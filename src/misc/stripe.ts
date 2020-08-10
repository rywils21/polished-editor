import { AppData } from "types";

export class Stripe {
  activateTrial(data: AppData) {
    // if (
    //   data.subscriptionInfo.activeTier === SubscriptionTiers.BASIC &&
    //   data.subscriptionInfo.trial.active === false &&
    //   data.subscriptionInfo.trial.available === true
    // ) {
    //   data.subscriptionInfo.activeTier = SubscriptionTiers.PRO;
    //   data.subscriptionInfo.trial.active = true;
    //   data.subscriptionInfo.trial.expires = `${Date.now()}`; // + 7 days
    //   data.subscriptionInfo.trial.available = false;
    // }
  }

  upgrade(data: AppData) {
    // data.subscriptionInfo.activeTier = SubscriptionTiers.PRO;
    // data.subscriptionInfo.trial.active = false;
    // data.subscriptionInfo.trial.expires = "";
    // data.subscriptionInfo.trial.available = false;
  }

  cancelTrial(data: AppData) {
    // data.subscriptionInfo.activeTier = SubscriptionTiers.BASIC;
    // data.subscriptionInfo.trial.active = false;
    // data.subscriptionInfo.trial.expires = "";
    // data.subscriptionInfo.trial.available = false;
  }

  reset(data: AppData) {
    // data.subscriptionInfo.activeTier = SubscriptionTiers.BASIC;
    // data.subscriptionInfo.trial.active = false;
    // data.subscriptionInfo.trial.expires = "";
    // data.subscriptionInfo.trial.available = true;
  }
}

export const stripe = new Stripe();
