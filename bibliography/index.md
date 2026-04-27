---
title: Writing
category: bibliography
layout: plain
---

## Books

<ul class="listing-list">
{%- for p in collections.bibliography %}
  <li><a href="{{ p.url }}">{{ p.data.title or p.fileSlug }}</a></li>
{%- endfor %}
</ul>

## Poems

<ul class="listing-list">
{%- for p in collections.poems %}
  <li><a href="{{ p.url }}">{{ p.data.title or p.fileSlug }}</a></li>
{%- endfor %}
</ul>

## Other Writing

<ul class="listing-list">
{%- for p in collections.writing %}
  <li><a href="{{ p.url }}">{{ p.data.title or p.fileSlug }}</a></li>
{%- endfor %}
</ul>
