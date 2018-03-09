---
bg: "vue.jpg"
layout: post
title:  "Vue.js Router"
crawlertitle: "vue.js Router"
summary: "Vue.js Router post"
date:   2018-02-07 12:00 +0900
categories: posts
tags: 'Vue.js'
author: codeMonkey
---

### Vue.js - Router ###

**Vue 포스트는 node, npm, git, vue-cli, webpack을 알고 있으며, 설치 했다는 가정하에 설명 합니다. 참고 서적은 [Do it! Vue.js 입문](http://www.yes24.com/24/Goods/58206961?Acode=101&) 입니다.**

---

#### VUE 라우터 ####

##### 라우터 기본 #####

- Vue에서 router는 기본적으로는 페이지 이동을 위해 쓸 수 있다.
- 클라이언트가 링크를 누르면 링크의 template을 불러온다. (router-link top="url")
- router-view에 불러온 template(데이터) 붙는다.

	``` html
	<div id="app">
		<h1>뷰 라우터 예제</h1>
		<p>
			<router-link to="/main">Main 컴포넌트로 이동</router-link>
			<router-link to="/login">Login 컴포넌트로 이동</router-link>
		</p>
		<router-view></router-view>

	  	<script>
			// 3. Main. Login 컴포넌트 내용 정의
			var Main = { template: '<div>main</div>' };
			var Login = { template: '<div>login</div>' };

			// 4. 각 url에 해당하는 컴포넌트 등록
			var routes = [
				{ path: '/main', component: Main },
				{ path: '/login', component: Login }
			];

			// 5. 뷰 라우터 정의
			var router = new VueRouter({
				mode: 'history', //해쉬 값 없앨 때
				routes
			});

			// 6. 뷰 라우터를 인스턴스에 등록
			var app = new Vue({
				router
			}).$mount('#app');
		</script>
    </div>
	```

##### 네스티드 라우터(Nested Router) #####
- 최소 2개 이상의 컴포넌트를 화면에 나타낼 수 있다.
- 예) 상위 컴포넌트 1개에 하위 컴포넌트 1개를 포함하는 구조
	``` html
	<div id="app">
      <router-view></router-view>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/vue@2.5.2/dist/vue.js"></script>
    <script src="https://unpkg.com/vue-router@3.0.1/dist/vue-router.js"></script>
    <script>
      var User = {
        template: `
          <div>
            User Component
            <router-view></router-view>
          </div>
        `
      };
      var UserInfo = { template: '<p>User Info Component</p>' };
      var UserPost = { template: '<p>User Post Component</p>' };

      var routes = [
        {
          path: '/user', 
		  component: User,
          children: [
            {
              path: '',
              component: UserInfo
            },
            {
              path: 'post',
              component: UserPost
            },
          ]
        }
      ];

      var router = new VueRouter({
        routes
      });

      var app = new Vue({
        router
      }).$mount('#app');
    </script>
	```
- 컴포넌트 수가 적을 때는 유용하지만 많아지면 컴포넌트를 표시하는데 한계가 있음.

##### 네임드 뷰(Named View) #####

- 특정 페이지로 이동했을 때 여러개의 컴포넌트를 동시에 표시하는 라이팅 방식.
	``` html
	<div id="app">
		<router-view name="header"></router-view> <!-- name의 값에 따라 표현되는 컴포넌트가 달라진다. -->
		<router-view></router-view> <!-- name이 없는 경우는 default 이다. -->
		<router-view name="footer"></router-view>
	</div>

	<script src="https://cdn.jsdelivr.net/npm/vue@2.5.2/dist/vue.js"></script>
	<script src="https://unpkg.com/vue-router@3.0.1/dist/vue-router.js"></script>
	<script>
		var Body = { template: '<div>This is Body</div>' };
		var Header = { template: '<div>This is Header</div>' };
		var Footer = { template: '<div>This is Footer</div>' };

		var router = new VueRouter({
			routes: [
			{
				path: '/',
				components: {
				default: Body, //기본으로 표시되는 component
				header: Header, // name="header"
				footer: Footer // name="footer"
				}
			}
			]
		})

		var app = new Vue({
			router
		}).$mount('#app');
	</script>
	```
