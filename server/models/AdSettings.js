import mongoose from "mongoose";

// One document of ad settings, edited at Admin > Ads. Ads are OFF until an admin switches them on.
const AdSettingsSchema = new mongoose.Schema({
    key: { type: String, default: 'main', unique: true },
    enabled: { type: Boolean, default: false },          // master switch: no ad script loads anywhere while this is off
    publisherId: { type: String, default: '' },          // "pub-1234567890123456" (the "ca-" prefix is added on the page)
    adsTxt: { type: String, default: '' },               // extra ads.txt lines; the Google line is added from publisherId
    onBlog: { type: Boolean, default: true },            // blog articles
    onLessons: { type: Boolean, default: true },         // Learn lessons
    onInterview: { type: Boolean, default: true },       // interview question and answer pages
    slotBlog: { type: String, default: '' },             // AdSense ad unit ids (digits)
    slotLessons: { type: String, default: '' },
    slotInterview: { type: String, default: '' },
    hideInEurope: { type: Boolean, default: true },      // no ads for visitors in Europe (browser time zone) until a Google-approved consent tool is set up
    cookieBanner: { type: Boolean, default: true },      // show the cookie choices banner
}, { timestamps: true });

export default mongoose.model("AdSettings", AdSettingsSchema);
