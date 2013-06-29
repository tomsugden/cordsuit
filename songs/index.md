---
title: Songs
layout: home
---

{% for p in pages %}
- [{{ p.title }}]({{ p.url }})
  {% if p.type == 'song' %}
- [{{ p.title }}]({{ p.url }})
  {% endif %}
{% endfor %}