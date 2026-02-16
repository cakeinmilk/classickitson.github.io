---
layout: default
title: Shows
permalink: /shows/
---

<div class="timeline-container">
  <button id="toggle-order-button" class="toggle-order-button" aria-label="Toggle Timeline Order">
    <span class="material-icons">swap_vert</span>
  </button>
  
  {% if site.shows %}
    {% assign shows = site.shows | sort: 'year' %}
    {% for show in shows %}
      <div class="timeline-item {% cycle 'left', 'right' %}" data-year="{{ show.year }}">
        <a href="{{ show.url | relative_url }}" class="timeline-card-link">
          <div class="timeline-card {{ show.type }}">
            {% if show.image_src %}
              <img src="{{ show.image_src | relative_url }}" alt="{{ show.title }}" class="timeline-card-svg" loading="lazy">
            {% endif %}
          </div>
        </a>
      </div>
    {% endfor %}
  {% else %}
    <p>No shows available at this time.</p>
  {% endif %}
</div>