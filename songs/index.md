---
title: Songs
layout: home
---

{% for p in site.pages %}
{% if p.category == 'songs' %}
- [{{ p.title }}]({{ site.url }}{{ p.url }})
{% endif %}
{% endfor %}