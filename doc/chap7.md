## handlerbars 基础

context 模版引擎的上下文环境

### handlebar 注释

```
{{！ super-secret comment}}
<!-- not -so secret comment -->
```

## 块级表达式

../. 进行上下级上下文切换

```
{{#each}}
{{/each}}
```

### 服务器端模版

对用户不可见

使用 app.set('view cache',true) 启用视图缓存。

{{>partial_name}} 引入模块

## 段落

* 模版引擎设置

* 模版中  
  {{#section 'sectionName'}}
  段落内容
  {{/section}}

* 布局中
  {{{\_section.sectionName}}}
