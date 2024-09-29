import {
  PiMapPinLineFill,
  PiYoutubeLogoFill,
  PiFacebookLogoFill,
  PiWhatsappLogoFill,
  PiInstagramLogoFill,
  PiMapTrifoldFill,
  PiPhone,
  PiEnvelopeSimpleFill,
  PiEnvelopeDuotone,
} from "react-icons/pi";
export default function InfoCard({ data }) {
  const openWhatsApp = (phoneNumber) => {
    // Format the URL for WhatsApp
    const url = `https://wa.me/${phoneNumber}`;

    // Open the URL
    window.location.href = url;
  };

  const openLink = (url) => {
    // Opens the URL in a new tab
    window.open(url, "_blank");
  };
  return (
    <div
      className="w-full relative flex justify-center"
      // style={{ backgroundImage: `url(${background})` }}
    >
      <div className="flex items-center flex-col gap-5 py-5">
        <div className="border-2 min-w-52 min-h-52 max-w-72 max-h-72 rounded-full overflow-hidden my-3">
          <img src={data?.ownerimg} className="w-full h-full" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-white text-4xl md:text-5xl flex flex-wrap">{data?.owner}</p>
          <small className="text-white text-base">(Founder & Owner)</small>
          <div className="flex gap-4 py-0">
            <p className="text-white flex flex-wrap items-center gap-3">
              <PiPhone />
              {data?.office}
            </p>
            <p className="text-white">/</p>
            <p className="text-white flex flex-wrap">{data?.mobile}</p>
          </div>
          <div className="flex gap-4 py-0">
            <p className="text-white flex flex-wrap items-center gap-3">
              <PiEnvelopeDuotone /> {data?.email}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-2 mt-3">
            <p className="text-white flex flex-wrap">GST NO. {data?.gst}</p>
            <p className="text-white flex flex-wrap">PAN NO. {data?.pan}</p>
          </div>
          <div className="flex items-center justify-center gap-3 mt-3">
            <PiMapPinLineFill className="text-white" size={30} />
            <p className="text-white capitalize w-72 flex flex-wrap">{data?.address}</p>
          </div>
          <div className="flex gap-4 py-3">
            {data?.youtube && (
              <button onClick={() => openLink(data?.youtube)}>
                <PiYoutubeLogoFill color="red" size={40} />
              </button>
            )}
            {data?.facebook && (
              <button onClick={() => openLink(data?.facebook)}>
                <PiFacebookLogoFill color="blue" size={40} />
              </button>
            )}
            {data?.insta && (
              <button onClick={() => openLink(data?.insta)}>
                <PiInstagramLogoFill className="text-orange-500" size={40} />
              </button>
            )}
            {data?.whatsapp && (
              <button onClick={() => openWhatsApp(data?.whatsapp)}>
                <PiWhatsappLogoFill className="text-green-500" size={40} />
              </button>
            )}

            {data?.map && (
              <button onClick={() => openLink(data?.map)}>
                <PiMapTrifoldFill className="text-blue-600" size={40} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
