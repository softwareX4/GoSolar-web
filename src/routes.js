import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import echarts from './views/charts/echarts.vue'
import vis from './views/charts/vis.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
/* 	{
		path:'/',
		redirect:'/vis'
	}, */
    {
        path: '/',
        component: Home,
        name: 'Charts',
		redirect:'/vis',
        iconCls: 'fa fa-bar-chart',
		leaf:'true',
        children: [
            //{ path: '/echarts', component: echarts, name: 'echarts' },
            { path: '/vis', component: vis, name: '可视化' }
        ]
    },
	 	
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;