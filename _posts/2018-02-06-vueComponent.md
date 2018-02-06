---
bg: "vue.jpg"
layout: post
title:  "Vue.js Component"
crawlertitle: "vue"
summary: "Vue.js Component post"
date:   2018-02-05 14:00 +0900
categories: posts
tags: 'Vue.js'
author: codeMonkey
---

### Vue.js - Component ###
**Vue 포스트는 node, npm, git, vue-cli, webpack을 알고 있으며, 설치 했다는 가정하에 설명 합니다.**

---


#### VUE 컴포넌트 ####

##### 1. 컴포넌트 global / local 유효범위 #####

- Vue 컴포넌트는 전역(global) 컴포넌트와 지역(local) 컴포넌트가 있다.
	``` javasctip
	<script>
		Vue.component('전역 컴포넌트 이름', {
			template : '<div>전역 컴포넌트</div>'
		})

		new Vue({
			el: '#app', // 뷰 인스턴스 유효범위 지정
			components: {
				'지역 컴포넌트 이름' : '<div>지역 컴포넌트</div>'
			}
		})
	</script>
	```

- 전역 컴포넌트는 Vue 전역에서 쓸 수 있다.
- 지역 컴포넌트는 속해있는 부모(여기서는 el : '#app') 유효범위 안에서만 사용 가능.
	``` html
	<div id="global">
		<global-component></global-component>
		<local-01-component></local-01-component> <!-- 이 부분은 유효범위('#app1') 밖이라 오류가 난다. -->
		<local-02-component></local-02-component> <!-- 이 부분은 유효범위('#app2') 밖이라 오류가 난다. -->
	</div>
	<div id="app1">
		<global-component></global-component> <!-- 전역은 사용가능! -->
		<local-01-component></local-01-component>
		<local-02-component></local-02-component> <!-- 이 부분은 유효범위('#app2') 밖이라 오류가 난다. -->
	</div>
	<div id="app2">
		<global-component></global-component> <!-- 전역은 사용가능! -->
		<local-01-component></local-01-component> <!-- 이 부분은 유효범위('#app1') 밖이라 오류가 난다. -->
		<local-02-component></local-02-component>
	</div>

	<script>
		Vue.component('global-component', {
			template : '<div>전역 컴포넌트</div>'
		})

		new Vue1({
			el: '#app1', // 뷰 인스턴스 유효범위 지정
			components: {
				'local-01-component' : '<div>지역 컴포넌트-01</div>'
			}
		})
		new Vue2({
			el: '#app2', // 뷰 인스턴스 유효범위 지정
			components: {
				'local-02-component' : '<div>지역 컴포넌트-02</div>'
			}
		})
	</script>
	```

##### Vue 컴포넌트 간 통신과 유효범위 #####

- 유효범위에 따라 지역 컴포넌트 간 데이터에 직접적으로 접근 할 수 없다.
- 이는 장/단점이 있을 수 있지만, 애플리케이션이 모두 동일한 데이터 흐름을 가지게 되고, 협업시에 장점이 된다.
- 상위 컴포넌트에서 하위 컴포넌트로 데이터를 전달이 가능하다. (props)
- 하위 컴포넌트에서 상위 컴포넌트로는 기본적으로 이벤트만 전달 가능.
	![Vue.js props](/jsStudyBlog/assets/images/props.png)

- **props:[]**
	- v-bind:propsData="msg" <-- 이렇게 부모의 데이터를 가져와 bind 시켜주면 자식 컴포넌트의 props로 msg를 가져올 수 있다.

	``` html
	<div id="app">
		<child-component v-bind:propsData="msg"></child-component>
	</div>

	<script>
		Vue.component('child-component', {
			props : ['propsData'],
			template : '<div>{{ propsData }}</div>'
		})

		new Vue({
			el: '#app',
			data : {
				msg : 'hi! Vue.js'
			}
		})
	</script>
	```
- child-component'를 전역으로 등록하고 상위 컴포넌트를 따로 등록하지 않아도 Vue 인스턴스 자체가 상위 컴포넌트가 된다.
- 최상의 컴포넌트를 "Root Component"라고 한다.
- Event Bus 방법을 통해 하위에서 상위로 데이터 전달이 가능 하다.

##### 이벤트 방생과 수신형식 #####
- 하위 컴포넌트에서 상위로 이벤트를 전달 할 수있다.
- **$emit(), v-on:**
	- 실행 순서
		1. showlog()
		2. v-on:show-log에 이벤트 전달, 여기서 'show-log'가 이벤트
		3. printText()

		``` html
		<div id="app">
			<child-component v-on:show-log="printText"></child-component>
			<!-- v-on:show-log -> 하위 컴포넌트 이벤트명 -->
			<!-- printText -> 상위 컴포넌트 메소드명 -->
		</div>

		<script>
			Vue.component('child-component', {
				template : '<button v-on:click="showLog">show</button>',
				methods : {
					showLog : function(){
						this.$emit('show-log');
					}
				}
			})

			new Vue({
				el: '#app',
				data : {
					msg : 'hi! Vue.js'
				},
				methods : {
					printText:function(){
						console.log("received an event!")
					}
				}
			})
		</script>
		```
- **같은 레벨 컴포넌트 간 통신**
	- 같은 레벨(자식/하위 컴포넌트) 간의 통신은 상위 레벨(부모/상위 컴포넌트)에 이벤트를 전달 후, 각 하위 컴포넌트에 props를 내려 보내야 한다.
	- 이런 방식은 고유의 유효 범위 때문인데, 다른 컴포넌트의 값을 직접 참조하지 못하기 때문이다.
	- 이런 통신 구조는 상위 컴포넌트가 필요 없음에도 불구하고 같은 레벨 간 통신을 위해 강제로 상위 컴포넌트를 두어야 한다.
	- 이를 해결할 수 있는 방법이 "이벤트 버스"이다.

##### 관계 없는 컴포넌트 간 통신 - "이벤트 버스" #####
- 이벤트 버스를 위해 새로운 인스턴스를 추가 한다.
- 이벤트를 보내는 컴포넌트에는 .$emit을 구현
- 이벤트를 받는 컴포넌트에서는 .$on을 구현

``` html
<div id="app">
	<child-component></child-component>
</div>

<script>
	var eventBus = new Vue();
	Vue.component('child-component', {
		template : '<div>하위 컴포넌트 영역입니다. <button v-on:click="showLog">show</button></div>',
		methods : {
			showLog : function(){
				eventBus.$emit('triggerEventBus', 100);
			}
		}
	})

	new Vue({
		el: '#app',
		data : {
			msg : 'hi! Vue.js'
		},
		created : function(){
			eventBus.$on('triggerEventBus', function(value){
				console.log('이벤트를 전달받음. 전달받은 값 : ', value);
			})
		}
	})
</script>
```
- 이벤트 버스를 활용하면 props를 쓰지 않고 원하는 컴포넌트 간에 직접적으로 데이터를 전달할 수 있어 편리하지만, 컴포넌트가 많아지면 어디서 어디로 데이터를 보냈는지 관리가 어려워 짐.
- 이 문제를 해결하려면 뷰엑스(Vuex)라는 상태 관리 도구로 관리한다.
