const PostMap = ({
  mode = 'place',
  lat = 13.76496,
  lng = 100.53829,
  heading = 0
}) => {
  const baseGoogleMapEmbeddedAPIUrl = `https://www.google.com/maps/embed/v1/${mode}?key=${process.env.NEXT_PUBLIC_GGMAP_API_KEY}`;
  const params =
    mode === 'place'
      ? `&q=${lat},${lng}&maptype=satellite`
      : mode === 'streetview' &&
        `&location=${lat},${lng}&heading=${heading}&pitch=10&fov=100`;
  const fullUrl =
    baseGoogleMapEmbeddedAPIUrl + params + '&language=th&region=TH';
  return (
    <div className="google-maps">
      <iframe
        src={fullUrl}
        width="600"
        height="450"
        style={{ border: 0, margin: '0 auto' }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default PostMap;
