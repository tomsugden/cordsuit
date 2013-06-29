---
title: Songs
layout: home
---

{% for p in site.pages %}
{{ p.title }}
  {% if p.type == 'song' %}
- [{{ p.title }}]({{ p.url }})
  {% endif %}
{% endfor %}