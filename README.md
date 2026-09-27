Place your MP4 file in this folder and name it `hero.mp4` so that the path becomes `assets/hero.mp4`.

Or change the video source in the `index.html` file (the `<video>` element) to a different path if you want to use a different name.

Vital Records:
- If the video is sourced from another server (external URL), the browser may block pixel reading (sampling) due to CORS. For the color to change automatically, the video must be hosted on the same domain or serve CORS headers that allow reading.

- For quick local testing, run a simple HTTP server in the project folder:

```bash
# Python 3
python -m http.server 8000

# lalu buka http://localhost:8000/ di browser
```

- If the file is too large, consider re-encoding it at a lower bitrate to speed up loading.


Sorry the website is pretty bad; I'll keep updating it whenever I have ideas.
