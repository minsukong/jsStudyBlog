---
bg: "vue.jpg"
layout: post
title:  "front end 용어/기술"
crawlertitle: "vue"
summary: "frontEnd Term & Skill"
date:   2018-02-21 14:00 +0900
categories: posts
tags: 'frontEnd'
author: codeMonkey
---

### frontEnd - frontEnd Term & Skill #01 ###

#### 알고 넘어가자 frontEnd ####
**앞단에 대해 알고 넘어가야 하는 부분을 천천히 알아 봅시다.**

##### html #####

- Tag의 쓰임새를 확실히 알고 있어야 한다. 

![html5 tag](/jsStudyBlog/assets/images/post/html5_tag.gif)
- 시맨틱 마크업이란 의미있게 html을 코딩하는 것이다. 이유는 아래와 같다.
	- **검색엔진의 최적화(SEO)** 
	- **접근성**
	- **유지보수**

- 구글의 방식(검색)
	<iframe width="560" height="315" src="https://www.youtube.com/embed/BNHR6IQJGZs" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
- SEO를 잘 하는 방법은 여러가지가 있지만, 기본은 의미있는 마크업이다.
- html5 시맨틱 마크업에 대해
	<iframe width="560" height="315" src="https://www.youtube.com/embed/BJq2fPFpqW8" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
- 'outline', 'sectioning elements' 이 부분이 html5 시맨틱 마크업의 핵심이다.
- sectioning roots : body, blockquote, details, fieldset, figure, td
- [outliner validate](https://gsnedders.html5.org/outliner/)
- [outliner 크롬 확장 프로그램](https://chrome.google.com/webstore/detail/html5-outliner/afoibpobokebhgfnknfndkgemglggomo?hl=ko)

##### Custom Attributes #####

- 시맨틱 마크업 만큼이나 'data-*'는 여러모로 유용하다.
- 'data' 속성과 'class' 속성의 방식의 차이는 다음과 같다.
	``` html
	<!-- class -->
	<ul>
		<li class="list list-important">중요 리스트</li>
		<li class="list list-sub">서브 리스트</li>
	</ul>

	<!-- data -->
	<ul>
		<li data-importance="important">중요 리스트</li>
		<li data-importance="sub">서브 리스트</li>
	</ul>
	```

- css로 선택 할 경우
	``` css
	/* class */
	.list{
		display: inline-block;
	}
	.list.important{
		font-weight: bold;
	}

	/* data */
	[data-importance]{
		display: inline-block;
	}
	[data-importance='important']{
		font-weight: bold;
	}
	```
- js로 선택 할 경우
	``` javascript
	/* class */
	var list = document.querySelectorAll('.list');

	/* data */
	var list = document.querySelectorAll('[data-importance]');
	```

- 위에서 언급 한데로 유용하기는 하나 문제점이 몇 가지 있다.
	- 검색 크롤러가 데이터 속성의 값을 찾지 못 한다.
	- 익스 11이하 [dataset을 지원하지 않음.](https://caniuse.com/#feat=dataset)
	- js 관련 [data 속성의 읽기 성능이 저조하다.](https://jsperf.com/data-dataset)


다음은 Custom Tag(custom elements)에 대해 알아 보겠습니다.