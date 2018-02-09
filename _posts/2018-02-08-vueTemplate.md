---
bg: "vue.jpg"
layout: post
title:  "Vue.js Template"
crawlertitle: "vue"
summary: "Vue.js Template post"
date:   2018-02-08 11:00 +0900
categories: posts
tags: 'Vue.js'
author: codeMonkey
---

### Vue.js - Template ###

**Vue 포스트는 node, npm, git, vue-cli, webpack을 알고 있으며, 설치 했다는 가정하에 설명 합니다. 참고 서적은 [Do it! Vue.js 입문](http://www.yes24.com/24/Goods/58206961?Acode=101&) 입니다.**

---

#### VUE 템플릿 ####

##### Vue 템플릿이란? #####

- Vue Template는 html,css등의 마크업 속성과 뷰 인스턴스에서 정의한 데이터 및 로직들을 연결하여 사용자가 브라우저에서 볼 수 있는 형태의 html로 변환해 주는 속성이다.
- 사용자가 볼 수는 없지만 라이브러리 내부적으로는 template속성에서 정의한 마크업 + 뷰 데이터를 가상 DOM 기반의 render() 함수로 변환 한다.
- 변환된 render() 함수는 최종적으로 사용자가 볼 수 있게 화면을 그리는 역활을 한다. 
- 변환 과정에서 뷰의 반응성(Reactivity)이 화면에 더해진다.

``` html
<script>
	new Vue({
		template: '<p>Hi</p>' // ES5
	});
</script>

<template>
	<p>Hi</p> <!-- ES6 -->
</template>
```

##### Template - Data Binding #####

- HTML 화면 요소를 뷰 인스턴스의 데이터와 연결하는 것을 의미.
- **{{ }}**는 뷰 인스턴스의 데이터를 html태그에 연결하는 가장 기본적인 텍스트 삽입 방식.
	``` html
	<div id="app">
		{{ msg }}
	</div>

	<script>
		new Vue({
			el: '#app',
			data: {
				msg : 'hi!!'
			}
		});
	</script>
	```
- data 속성의 msg가 값이 바뀌면 뷰 반응성에 의해 화면이 자동 갱신.
- **v-once** 데이터가 변경되도 값을 바꾸고 싶지 않다면 아래와 같이 하면 된다.
	``` html
	<div id="app" v-once>
		{{ msg }}
	</div>
	</script>
	```

- **v-bind**
	- v-bind는 아이디,클래스,스타일 등의 html 속성 값에 뷰 데이터 값을 연결할 때 사용하는 데이터 연결 방식.
	- v-bind 속성으로 지정할 html 속성이나 props속성 앞에 접두사로 붙여 준다.
	``` html
	<div id="app">
      <p v-bind:id="isId">id 바인딩</p>
      <p v-bind:class="isClass">class 바인딩</p>
      <p v-bind:style="isStyle">style 바인딩</p>
    </div>

    <script>
      new Vue({
        el: '#app',
        data: {
          isId: 'id01',
          isClass: 'class01',
          isStyle: 'background-color: red;'
        }
      });
    </script>
	```
	- 약식 문법으로 v-bind:id - > :id
	- 가급적 v- 접두사를 쓸 것, 기존 html 문법과 구분도 되고, 다른 사람이 코드를 파악하기도 쉬워진다.

##### Template - 자바스크립트 표현식 #####

- 뷰 템플릿에서도 자바스크립트 표현식 가능
	``` html
	<div id="app">
      <p>{{ msg }}</p>
      <p>{{ msg + "!!!" }}</p>
      <p>{{ msg.split('').reverse().join('') }}</p>
    </div>

    <script>
      new Vue({
        el: '#app',
        data: {
          msg: 'hi!'
        }
      });
    </script>
	```
- 자바스크립트의 선언문과 분기 구문을 사용할 수 없음.
- 복잡한 연산은 인스턴스 안에서 처리, 화면에는 간단한 연산 결과만 표시
	```html
	<div id="app">
      <!-- 1. -->
      {{ var a = 10; }} <!-- X -->
      {{ if (true) {return 100} }} <!-- X -->
      {{ true ? 100 : 0 }} <!-- 삼항 연산자 O -->

      <!-- 2. -->
      {{ message.split('').reverse().join('') }} <!-- X, 복잡한 연산은 인스턴스 안에서 수행 -->
      {{ reversedMessage }} <!-- O, 스크립트에서 computed 속성으로 계산 후 최종 값만 표현 -->
    </div>

    <script>
      new Vue({
        el: '#app',
        data: {
          message: 'Hello Vue.js!'
        },
        computed: { // cahing
          reversedMessage: function() {
            return this.message.split('').reverse().join('');
          }
        }
      });
    </script>
	```

##### Template - Directive #####

- v- 접두사를 가지는 모든 속성들을 의미.

|  Directive name | 역활 |
| ------ | ------ |
| v-if | 지정한 뷰 데이터의 값을 참, 거짓 여부에 따라 해당 Html을 화면에 표시 하거나 표시하지 않음 |
| v-for | 지정한 뷰 데이터의 개수만큼 해당 Html을 반복 출력 |
| v-show | v-if와 유사하게 데이터의 진위 여부에 따라 해당 Html 태그를 화면에 표시하거나 하지 않음. v-if는 완전히 삭제하지만, v-show는 display:none;으로 주어 실제 태그는 남아 있음. |
| v-bind | Html 태그의 기본 속성과 뷰 속성을 연결. |
| v-on | 화면 요소의 이벤트를 감지하여 처리할 때 사용. ex) v-on:click |
| v-model |  form에서 주로 사용됨. form에 입력한 값을 뷰 인스턴스의 데이터와 즉시 동기화. 화면에 입력된 값을 저장하여 서버에 보내거나 watch와 같은 고급 속성을 이용하여 추가 로직을 수행. input, select, textarea 태그에서 사용가능.  |

##### Template - advanced #####

- **computed**
	- data 속성 값의 변화에 따라 자동 갱신.
	- 캐싱(cahing)을 함.
- **method**
	- 호출시에만 해당 로직 수행.
	- 캐싱(cahing) 하지 않음.
- 복잡한 연산을 반복 수행해서 화면에 나타낼 때는 computed 이용.
- **watch**
	- 데이터 변화를 감지하여 자동으로 특정 로직 수행.
	- computed와 비슷하지만 computed는 내장 API를 활용한 간단한 연산에 적합, watch속성은 데이터 호출과 같은 시간이 상대적으로 더 많이 소모되는 비동기 처리에 적합.

	``` html
	<div id="app">
      <input v-model="message">
    </div>

    <script>
      new Vue({
        el: '#app',
        data: {
          message: 'Hello Vue.js!'
        },
        watch: {
          message: function(data) {
            console.log("message의 값이 바뀝니다 : ", data);
          }
        }
      });
    </script>
	```
	- input(v-model로 바인딩)의 값이 바뀌면 data도 실시간으로 갱신.