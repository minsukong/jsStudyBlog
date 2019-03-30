---
bg: "react-skill.jpg"
layout: post
title:  "react.js skill"
crawlertitle: "react.js skill"
summary: "Vue.js vuex"
date:   2019-03-30 23:00 +0900
categories: posts
tags: 'react.js'
author: codeMonkey
---

### react - react를 다루는 기술 ###

![react-sill](/jsStudyBlog/assets/images/post/react-skill.png)

***리액트를 다루는 기술 정리***

이번 포스팅에서는 책 "리액트를 다루는 기술"에 대한 정리 입니다.

***리마인드 포스팅입니다.***

#### 책의 목차

1. 리액트 시작
2. JSX
3. 컴포넌트
4. 이벤트 핸들링
5. ref: DOM에 이름 달기
6. 컴포넌트 반복
7. 컴포넌트의 라이프사이클 메서드
8. 함수형 컴포넌트
9. 컴포넌트 스타일링
10. 일정 관리 웹 어플리케이션 생성
11. 컴포넌트 리렌더링 최적화
12. 리덕스 개념 이해
13. 리더스로 리액트 애플리케이션 상태관리
14. 리덕스, 더 편하게 사용
15. 리덕스 미들웨어와 외부 데이터 연동
16. react-router로 SPA 개발
17. 코드 스필리팅 
18. 백앤드 프로그래밍:Node.js의 Koa 프레임 워크
19. mongoose를 이용한 MongoDB 연동 실습
20. 블로그 프로젝트
21. 프로젝트에서 API 연동
22. 프로젝트 마무리 작업

#### 1장 (skip)
#### 2장 (skip)
#### 3장 컴포넌트
***props***
- props 기본값을 정하기 
    class 안에 'static'으로 설정 한다.
    ```jsx
        class MyComponent extends Component{
            static defaultProps = {
                name: 'default...'
            }
        }
    ```
- props-types 설정
    ```jsx
        class MyComponent extends Component{
            static defaultProps = {
                name: 'default...'
            }

            static propTypes={
                name: PropTypes.string //isRequired : 필수요소
            }
        }
    ```
- propsType 종류
    - array
    - bool
    - func
    - number
    - object
    - string
    - symbol
    - node (렌더링 할 수 있는 모든 것)
    - element (리액트 요소)
    - instanceOf(MyClass : 특정 클래스의 인스턴스)
    - oneOfType (주어진 배열안의 종류 중 하나)
    - arrayOf (주어진 종류로 구성된 배열)
    - objectOf (주어진 종류의 값을 가진 객체)
    - shape (주어진 스키마를 가진 객체)
    - any (아무 종류)

- state : constroctor로 state 초기값 설정
    ```jsx
        class MyComponent extends Component{
            
            constroctor(props) {
                super(props)
                this.state = {
                    number: 0
                }
            }

        }
    ```
- state : state 값 업데이트
    ```jsx
        this.setState({
            number: this.state.number + 1
        })
    ```
- 그 외 state, propsTypes는 constroctor 외부에 선언 가능하다.
- Property Initializer Syntax
    - constroctor 없이 작성이 가능하다.

#### 4장 이벤트 핸들링
- 주의 사항
    - 이벤트는 camelCase로 작성한다
    - 이벤트에 실행할 js 코드를 전달하는 것이 아니라, 함수 형태의 값을 전달 한다.
    - component에 직접적으로 이벤트를 설정 할 수 없다.(DOM 요소에만 가능)
- 이벤트 종류[react이벤트종류](http://facebook.github.io/react/docs/event.html) 
- SyntheticEvent는 웹 브라우저의 네이티브 이벤트를 감싸는 객체(html 이벤트를 다룰 때와 똑같이 사용.)
#### 5장 ref: DOM에 이름 달기
- 특징
    - 보통은 ref 없이 state의 값의 업데이트를 이용한다.
    - DOM을 꼭 사용하는 상황에 사용.
- ref 사용은 아래와 같이 사용.(this.input.focus() input 요소에 포커스 된다.)
    ```jsx
        <input ref={(ref) => {this.input = ref}} /> // this.testInput = ref 이렇게 이름 지어도 된다.
    ```
- component에 ref
    ```jsx
        <MyComponent ref={(ref) => {this.myComponent = ref}}
    ```
    - 컴포넌트에 ref을 달면 MyComponent 내부 메서드 및 멤버 변수에 접근 가능
    - myComponent.handleClick 이런식으로 메서드 접근이 가능하다.
    - ref를 컴포넌트간 데이터를 주고받는 방식으로 사용 X
#### 6장
#### 7장



