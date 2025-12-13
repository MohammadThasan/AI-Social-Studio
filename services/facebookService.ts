
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

// Allow App ID to be set dynamically if not present in env
let activeAppId = process.env.FACEBOOK_APP_ID || '';

export const setFacebookAppId = (id: string) => {
  activeAppId = id;
};

export const hasFacebookAppId = () => {
  return !!activeAppId;
};

/**
 * Initialize the Facebook JS SDK
 */
export const initFacebookSdk = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.FB) {
      // If the SDK is loaded, ensure it's initialized with our App ID if we have one
      if (activeAppId) {
        try {
            window.FB.init({
                appId      : activeAppId,
                cookie     : true,
                xfbml      : true,
                version    : 'v19.0'
            });
        } catch (e) {
            // It might already be initialized, which is fine
            console.warn("FB Init warning (safe to ignore if already initialized):", e);
        }
      }
      resolve();
      return;
    }

    window.fbAsyncInit = function() {
      // If we don't have an ID yet, we can't properly init for login
      // But we must resolve so the app doesn't hang.
      if (!activeAppId) {
        console.log("Facebook SDK loaded, waiting for App ID...");
        resolve(); 
        return;
      }
      
      try {
        window.FB.init({
            appId      : activeAppId,
            cookie     : true,
            xfbml      : true,
            version    : 'v19.0'
        });
        resolve();
      } catch (e) {
        console.warn("FB Init failed", e);
        resolve();
      }
    };

    // Load the SDK asynchronously
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       // @ts-ignore
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       // @ts-ignore
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  });
};

/**
 * Check if user is already logged in (for automated session restoration)
 */
export const checkLoginStatus = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!window.FB) return reject("FB not loaded");
      
      // If no App ID is set, we can't check status reliably against an app
      if (!activeAppId) return reject("No App ID");

      window.FB.getLoginStatus((response: any) => {
        if (response.status === 'connected') {
          resolve(response.authResponse);
        } else {
          reject("Not connected");
        }
      });
    });
  };

/**
 * Login to Facebook requesting pages permissions
 */
export const loginToFacebook = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!window.FB) {
        if (!document.getElementById('facebook-jssdk')) {
            return reject("Facebook SDK not loaded");
        }
    }

    if (!activeAppId) return reject("Facebook App ID is missing. Please enter it to proceed.");

    // Ensure init was called with the ID if it wasn't before
    // Note: Re-calling init with the same ID is safe.
    try {
        window.FB.init({
            appId      : activeAppId,
            cookie     : true,
            xfbml      : true,
            version    : 'v19.0'
        });
    } catch (e) {
        console.warn("FB Re-init warning", e);
    }

    window.FB.login((response: any) => {
      if (response.authResponse) {
        resolve(response.authResponse);
      } else {
        reject("User cancelled login or did not fully authorize.");
      }
    }, { scope: 'pages_show_list,pages_manage_posts,pages_read_engagement' }); 
  });
};

/**
 * Get the current user's info
 */
export const getFacebookUser = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    window.FB.api('/me', { fields: 'name,id,picture' }, (response: any) => {
      if (!response || response.error) {
        reject(response?.error || 'Failed to fetch user');
      } else {
        resolve(response);
      }
    });
  });
};

/**
 * Get list of pages the user manages
 */
export const getFacebookPages = (userId: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    // Explicitly request access_token to ensure we can publish
    window.FB.api(`/${userId}/accounts`, { fields: 'name,access_token,id,category' }, (response: any) => {
      if (!response || response.error) {
        reject(response?.error || 'Failed to fetch pages');
      } else {
        resolve(response.data);
      }
    });
  });
};

// Helper to convert data URI to Blob
const dataURItoBlob = (dataURI: string) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {type: mimeString});
};

/**
 * Publish content to a specific page.
 * Supports Image (Photos endpoint) or Text-only (Feed endpoint).
 */
export const publishToFacebookPage = async (pageId: string, pageAccessToken: string, message: string, imageUrl?: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    
    // 1. Handle Image Post (Photos Endpoint)
    // We use raw fetch here because handling Blobs via the JS SDK .api() method can be inconsistent across versions/environments
    if (imageUrl && imageUrl.startsWith('data:')) {
      try {
        const blob = dataURItoBlob(imageUrl);
        const formData = new FormData();
        formData.append('access_token', pageAccessToken);
        formData.append('message', message);
        formData.append('source', blob);
        
        fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
            method: 'POST',
            body: formData
        })
        .then(async (res) => {
            const data = await res.json();
            if (!res.ok || data.error) {
                // If photo upload fails, we reject. The UI can decide to retry or fail.
                reject(data.error || new Error("Failed to upload photo to Facebook."));
            } else {
                resolve(data);
            }
        })
        .catch(err => reject(err));
        
        return;
      } catch (e) {
        console.warn("Failed to process image for upload, attempting text-only fallback:", e);
        // Fall through to text only
      }
    }

    // 2. Handle Text Post (Feed Endpoint)
    if (!window.FB) {
        reject("Facebook SDK not ready.");
        return;
    }

    window.FB.api(
      `/${pageId}/feed`,
      'POST',
      { message: message, access_token: pageAccessToken },
      (response: any) => {
        if (!response || response.error) {
          reject(response?.error || 'Failed to publish post');
        } else {
          resolve(response);
        }
      }
    );
  });
};
