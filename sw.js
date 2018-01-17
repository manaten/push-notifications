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

/* eslint-env browser, serviceworker, es6 */

'use strict';

self.addEventListener('push', function(event) {
  const data = event.data.json();
  console.log(data);
  console.log('[Service Worker] Push Received.');
  console.log('[Service Worker] Push had this data:', data);

  const title = data.title;
  const options = {
    body: data.body,
    icon: data.icon,
    image: data.image,
    badge: data.badge,
    data: data,
    actions: [
      { action: 'game', title: 'ゲームページを開く', icon: 'images/icon.png' },
      { action: 'user', title: '作者ページを開く', icon: 'images/icon.png' }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();
  console.log(event.notification.data);
  console.log(event.action);
  if (event.action === 'game') {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log(event);
});
