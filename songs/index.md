---
title: Songs
layout: home
---

{% for p in site.pages %}
{{ p.title }} - {{ p.date }}
  {% if p.category == 'songs' %}
- [{{ p.title }}]({{ p.url }})
  {% endif %}
{% endfor %}