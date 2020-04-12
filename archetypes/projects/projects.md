---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
# description
description: "This is meta description"
image: "images/projects/{{ lower .fields.Name }}/{ lower .fields.Name }}_small.png"
tags: [""]
categories: [""]
content: {{ .content }}
name: {{ .fields.Name }}
---