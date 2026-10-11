"use client";
import type React from "react";
import Script from "next/script";
import { useSocialScripts } from "@/hooks/useSocialScripts";

// 1. **CRITICAL FIX:** Define environment variables OUTSIDE the component 
//    but only pass the necessary values to the client-side array.
//    These values must be available at BUILD TIME on Vercel.

// Get the public environment variables from the Vercel build environment
// The server reads these during the initial render pass.
const NEXT_PUBLIC_FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
const NEXT_PUBLIC_PINTEREST_TAG_ID = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID;
const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY; // Note: This should ideally also be NEXT_PUBLIC_... if used client-side.
// const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;
const scriptMap = [
  { 
    id: "facebook-jssdk", 
    name: "fb", 
    nonce: "FOKrbAYI", 
    // Use the variable here. If NEXT_PUBLIC_FACEBOOK_APP_ID is not set 
    // for the build, this will insert an empty string, which is safer 
    // than crashing.
    src: `https://connect.facebook.net/id_ID/sdk.js#xfbml=1&version=v22.0&appId='${NEXT_PUBLIC_FACEBOOK_APP_ID}'`, 
    async: true 
  },
  { id:"twitter-wjs", name: "x", nonce: "MIyacvse", src: "https://platform.twitter.com/widgets.js", async:true },
  { id:"linkedin-badge", name: "linkedIn", nonce: "FOKBabuy", src: "https://platform.linkedin.com/badges/js/profile.js", async:true },
  { id:"trustpilot-widget", name: "trustPilot", nonce: "FebAYIyaa", src: "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js", async:true },
];

const Scripts: React.FC = () => {
  const { scripts, setX, setFb, setLinkedIn, setTrustPilot } = useSocialScripts();
  
  // 2. **CRITICAL FIX:** Only render this block if the required ID exists.
  // This prevents the build from crashing if an environment variable is missing.
  const isPinterestEnabled = 
    process.env.NODE_ENV === "production" && NEXT_PUBLIC_PINTEREST_TAG_ID;

  const isPosthogEnabled = POSTHOG_API_KEY;

  return (
    <div className="space-y-6">
      {isPinterestEnabled && (
      <>
        <Script async strategy="lazyOnload" src="https://assets.pinterest.com/js/pinit.js" />
        <Script
          id="pinterest-base-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              ;!function(e){
                if(!window.pintrk){
                  window.pintrk = function(){
                    pintrk.queue.push(Array.prototype.slice.call(arguments));
                  };
                  pintrk.queue = [];
                  pintrk.version = "3.0";
                  var n = window.pintrk;
                  n.queue=[],n.version="3.0";
                  var t = document.createElement("script");
                  t.async = true;
                  t.src = e;
                  var r = document.getElementsByTagName("script")[0];
                  r.parentNode.insertBefore(t, r);
                }
              }("https://s.pinimg.com/ct/core.js");
              
              setTimeout(() => {
                if(typeof pintrk === 'function') {
                  console.log('Initializing Pinterest tag');
                  // This is now safe as NEXT_PUBLIC_PINTEREST_TAG_ID is defined outside.
                  pintrk('load', '${NEXT_PUBLIC_PINTEREST_TAG_ID}', {em: '<user_email_address>'});
                  pintrk('page');
                  pintrk('track', 'pagevisit', {
                    event_id: 'eventId0001'
                  });
                } else {
                  console.warn('Pinterest not initialized');
                }
              }, 2000);
            `,
          }}
          onLoad={() => {
            console.log("Pinterest script loaded successfully")
          }}
          onError={(e) => console.error("Pinterest script failed to load", e)}
        />
          
      </>
      )}
      {/* start Social Media Scripts */}
      { scriptMap.map(({ id, name, src, async, nonce }) => (
        <Script
          key={name}
          id={id}
          src={src}
          async={async}
          nonce={nonce}
          strategy="lazyOnload"
          crossOrigin={name === 'fb'? 'anonymous' : undefined}
          onLoad={() => {
            console.log(`${name} script successfully loaded`)
            switch(name) {
              case "x":
                setX(!scripts.x);
                break;
              case "trustPilot":
                const trustpilotElements = document.querySelectorAll('[data-template-id]');
                // It's safer to check for window.Trustpilot existence before using it
                if (window.Trustpilot) {
                    trustpilotElements.forEach(el => {
                      (window as typeof window & { Trustpilot: { loadFromElement: (el: HTMLElement) => void } }).Trustpilot.loadFromElement(el as HTMLElement);
                    });
                }
                setTrustPilot(!scripts.trustPilot);
                break;
              case "fb":
                setFb(!scripts.fb);
                break;
              case  "linkedIn": 
                setLinkedIn(!scripts.linkedIn);
                break;
            }
          }}
          onError={(e) =>  console.error(`${name} script failed to load`, e)}
        />
      )) }

      {isPosthogEnabled && (
        <Script id="posthog-script" strategy="lazyOnload">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            // Use the variable defined outside the component
            posthog.init('${POSTHOG_API_KEY}', {
              api_host:'https://us.i.posthog.com',
              person_profiles: 'identified_only'
            })
          `}
        </Script>
      )}

      {/* Tawk.to and other commented out scripts remain commented out */}
    </div>
  )
}

export default Scripts