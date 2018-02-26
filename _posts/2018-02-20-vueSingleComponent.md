---
bg: "vue.jpg"
layout: post
title:  "Vue.js Single Component"
crawlertitle: "vue"
summary: "Vue.js Single Component post"
date:   2018-02-20 11:00 +0900
categories: posts
tags: 'Vue.js'
author: codeMonkey
---

### Vue.js - Single Component ###

**Vue 포스트는 node, npm, git, vue-cli, webpack을 알고 있으며, 설치 했다는 가정하에 설명 합니다. 참고 서적은 [Do it! Vue.js 입문](http://www.yes24.com/24/Goods/58206961?Acode=101&) 입니다.**

---
- **gitpage를 jekyll로 만들었는데 {} 안에 {}을 한번 더 쓰면 오류가 나네요. 예제에 {} 적어놓은 부분은 Vue 표현식으로 {} 안에 {}를 한번 더 해주세요.**

#### VUE 싱글 컴포넌트 ####

##### Vue 싱글 컴포넌트란? #####

- 확장자 .vue 파일로 프로젝트 구조를 구성하는 방식.

``` html
<template>
	<!-- html or custom tag  -->
</template>

<script>
	export default {
		// data, methods
	}
</script>

<style>
</style>
```

``` html
<style lang="scss">
  @import 'layout.scss'; /* import도 가능 */
</style>
```
