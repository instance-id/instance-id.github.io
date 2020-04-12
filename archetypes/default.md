---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
# description
description: "This is meta description"
image: "images/projects/{{ lower .Name }}/{ lower .Name }}_small.png"
tags: [""]
categories: [""]
content: {{ .Content }}
---