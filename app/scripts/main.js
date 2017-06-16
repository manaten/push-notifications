/*
 *
 *  Push Notifications codelab
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

/* eslint-env browser, es6 */

'use strict';

const applicationServerPublicKey = 'BPUzqhTsNz4wpHKt690KhpT6wrQk6D6ZeeVbbZWtMGbxj7_iR9YnL40ObfaHX1nEo-Q204mqjN5R9ZoJstCmP0g';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;

function log(...str) {
  console.log(...str);
  const consoleDom = document.getElementById('console');
  if (consoleDom) {
    consoleDom.textContent += str.join(' ') + '\n';
  }
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

let swRegistration = null;
if ('serviceWorker' in navigator && 'PushManager' in window) {
  log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
    .then(function (swReg) {
      log('Service Worker is registered', swReg);

      swRegistration = swReg;
      initialiseUI();
    })
    .catch(function (error) {
      log('Service Worker Error ', error);
    });
} else {
  log('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
    .then(function(subscription) {
      log('User is subscribed:', subscription);
      updateSubscriptionOnServer(subscription);
      isSubscribed = true;
    })
    .catch(function(err) {
      log('Failed to subscribe the user: ', err);
    })
    .then(updateBtn);
}
function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
    .then(function(subscription) {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .catch(function(error) {
      log('Error unsubscribing', error);
    })
    .then(function() {
      updateSubscriptionOnServer(null);
      log('User is unsubscribed.');
      isSubscribed = false;
      updateBtn();
    });
}
function initialiseUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
    .then(function (subscription) {
      isSubscribed = !(subscription === null);

      if (isSubscribed) {
        log('User IS subscribed.');
      } else {
        log('User is NOT subscribed.');
      }

      updateBtn();
    });
}
function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'プッシュ通知はブロックされています';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'プッシュ通知を無効化する';
  } else {
    pushButton.textContent = 'プッシュ通知を有効にする';
  }

  pushButton.disabled = false;
}
function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails = document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}
