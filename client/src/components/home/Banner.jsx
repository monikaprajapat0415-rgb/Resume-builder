import { useSiteContent } from '../../utils/siteContent'

export default function Banner() {
    const site = useSiteContent()
    if (site.banner_show === 'false') return null
    return (
        <div className="w-full py-2.5 font-medium text-sm text-brand-800 text-center bg-gradient-to-r from-brand-200 to-[#FDFEFF]">
            <p>{site.banner_badge && <span className="px-3 py-1 rounded-lg text-white bg-brand-600 mr-2">{site.banner_badge}</span>}{site.banner_text}</p>
        </div>
    );
};
