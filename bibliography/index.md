---
title: Bibliography
category: bibliography
layout: plain
---

## Books

<ul>
{% for p in site.pages %}
  {% if p.category == page.category and p.title != page.title %}
    <li><a href="{{ p.url }}">{{ p.title }}</a></li>
  {% endif %}
{% endfor %}
</ul>

## Poems

<ul>
{% for p in site.pages %}
  {% if p.category == 'poems' and p.layout != 'category' %}
    <li><a href="{{ p.url }}">{{ p.title }}</a></li>
  {% endif %}
{% endfor %}
</ul>

## Misc. Writing

<ul>
{% for p in site.pages %}
  {% if p.category == 'writing' and p.layout != 'cateogry' %}
    <li><a href="{{ p.url }}">{{ p.title }}</a></li>
  {% endif %}
{% endfor %}
</ul>