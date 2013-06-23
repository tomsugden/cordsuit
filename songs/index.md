---
title: Songs
layout: home
---

{% for p in pages %}
  {% if p.layout == 'song' %}
- [{{ p.title }}]({{ p.url }})
  {% endif %}
{% endfor %}