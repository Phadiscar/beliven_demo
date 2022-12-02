import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
// Library
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

// PERSIST STATE
const pinia = createPinia();

pinia.use((contex) => {

    const storeId = contex.store.$id;

    const serialize = {
        serialize: JSON.stringify,
        deserialize: JSON.parse
    }

    //Sync store
    const fromStorage = serialize.deserialize(window.localStorage.getItem(storeId))

    if (fromStorage) {
        contex.store.$patch(fromStorage);
    }

    contex.store.$subscribe((mutation, state) => {
        window.localStorage.setItem(storeId, serialize.serialize(state))
    })

})

// APP
createApp(App)
    .use(pinia)
    .mount('#app')
