import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './views/Home.vue';
import NewCharacter from './views/NewCharacter.vue';
import UserProfile from './views/UserProfile.vue';
import Login from './views/Login.vue';
import CharacterDetail from './views/CharacterDetail.vue'
import Administrator from './views/Administrator.vue'
import Logout from './views/Logout.vue'
import SignUp from './views/SignUp.vue'
import UserInfo from './views/UserInfo.vue'
import EditCharacter from './views/EditCharacter.vue'


const router = createRouter({

    history: createWebHashHistory(),
    routes:[
        { path: '/',
            redirect: '/Login'  },
        { path: '/Home',
            component: Home },
        { path: '/NewCharacter',
            component: NewCharacter },
        { path: '/UserProfile',
            component: UserProfile },
        { path: '/CharacterDetail/:id',
            name: 'CharacterDetail',
            component: CharacterDetail },
        { path: '/Login',
            component: Login },
        { path: '/Administrator',
            component: Administrator },
        { path: '/Logout',
            component: Logout },
        { path: '/SignUp',
            component: SignUp },
        { path: '/EditCharacter/:id',
            name: 'EditCharacter',
            component: EditCharacter },
        { path: '/UserInfo',
            component:UserInfo},
        { path: '/UserProfile/:id',
            name: "otherUserProfile",
            component:UserProfile}
    ]
});

export default router;