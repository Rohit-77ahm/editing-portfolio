# Rohit Yadav — Video Editor Portfolio

A responsive, single-page portfolio built with plain HTML, CSS and vanilla JavaScript. No frameworks, package manager or build step required.

## Files

- `index.html` — page content, SEO/social metadata and editable project links
- `style.css` — layout, typography, responsive styles and accent colour
- `script.js` — mobile navigation, scroll reveals, carousel, video modal and copy button
- `assets/` — add your own images and local video files here

## Run locally

Open `index.html` in a browser. For a more reliable local preview, use the VS Code Live Server extension or run a simple static server.

## Customise before publishing

1. Replace `assets/portrait.jpg` and `assets/about.jpg`.
2. Add `assets/work-01.jpg` through `assets/work-04.jpg`.
3. In `index.html`, replace the four `PASTE_VIDEO_LINK_0X` values with YouTube/Vimeo embed URLs or local MP4 paths.
4. Replace `YOUR_USERNAME` and `YOUR_DISCORD_USERNAME`.
5. Update the Open Graph image URL to an absolute URL after deployment.
6. Check the contact email and all links.

### Video URL examples

- YouTube: `https://www.youtube.com/embed/VIDEO_ID`
- Vimeo: `https://player.vimeo.com/video/VIDEO_ID`
- Local MP4: `assets/my-edit.mp4`

For local MP4s, put the video file in `assets/` and use its relative path in the matching `data-video` attribute.

## Deploy free

### Netlify Drop
Visit https://app.netlify.com/drop and drag the entire unzipped project folder into the upload area.

### Vercel
Upload the project to a GitHub repository, import it at https://vercel.com/new, select **Other** as the framework preset, leave build settings empty, and deploy.

## Notes

- The design uses Google Fonts; the fonts load over the internet. System sans-serif fallbacks are included.
- Placeholder image files are not included. Until you add your own photos, styled placeholders appear automatically.
- The listed age is included because it was part of the supplied brief. Consider whether you want your age publicly displayed before publishing.
