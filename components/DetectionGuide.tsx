"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type Rule = {
title: string;
desc: string;
image?: string;
};

const rules: Rule[] = [

{
title:"Artifact – Shape distortion",
desc:"Objects that appear to move linearly but have irregular shapes or distorted profiles are usually image artifacts rather than real asteroids.",
image: "/vault/irregular.png"
},

{
title:"Zoom verification",
desc:"Some objects appear to move like asteroids, but when zoomed in they reveal pixel artifacts or cosmic ray hits.",
image: "/vault/zoomverification.png"
},

{
title:"Magnitude fluctuation",
desc:"Real asteroids maintain consistent brightness. If magnitude changes by more than 1 between frames, it is likely an artifact.",
image: "/vault/fluctuation.png"
},

{
title:"Saturated star bleed",
desc:"Bright stars can saturate CCD sensors, producing streaks or ghost signals. Never measure saturated objects.",
image: "/vault/saturated.png"
},

{
title:"Grid flickering",
desc:"Objects that appear to move may actually be caused by image grid alignment issues. Flickering star outlines indicate frame alignment artifacts.",
image: "/vault/flickering.png"
},

{
title:"Known objects",
desc:"If the asteroid already exists in the Minor Planet Center database, it should not be included in preliminary discovery reports.",
image: "/vault/known.png"
},

{
title:"True asteroid signature",
desc:"Valid asteroid candidates move in a straight line at constant speed, maintain similar brightness, and have rounded edges darker at the center.",
image: "/vault/valid.png"
}

];

export default function DetectionGuide(){

const primaryRules = rules.filter((rule) => [
"Artifact – Shape distortion",
"Zoom verification",
"Magnitude fluctuation",
"Saturated star bleed"
].includes(rule.title));

const finalRowRules = rules.filter((rule) => [
"Grid flickering",
"Known objects",
"True asteroid signature"
].includes(rule.title));

return(

<div className="space-y-10">

<div className="space-y-6">

<h3 className="text-center text-sm uppercase tracking-[0.22em] text-white/55">
Common rejection checks
</h3>

<div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

{primaryRules.map((rule, i) =>(

<motion.div
key={rule.title}
className="dashboard-card vault-emerald-tablet p-6"
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
whileHover={{ y: -4 }}
viewport={{ once: true }}
transition={{ duration: 0.4, delay: i * 0.07 }}
>

{rule.image && (
<div className="relative -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-[0.7rem] aspect-[4/3]">
<Image
src={rule.image}
alt={`${rule.title} reference image`}
fill
sizes="(min-width: 1280px) 24vw, (min-width: 768px) 46vw, 92vw"
className="object-cover"
quality={65}
/>
<div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[rgba(5,12,20,0.22)]" />
</div>
)}

<h3 className="text-white/90 mb-3 font-light">
{rule.title}
</h3>

<p className="text-white/60 text-sm leading-relaxed">
{rule.desc}
</p>

</motion.div>

))}

</div>

<h3 className="text-center text-base md:text-lg uppercase tracking-[0.2em] text-[var(--radar-green)]/85 pt-5 pb-1">
Be on the know
</h3>

<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

{finalRowRules.map((rule, i) =>(

<motion.div
key={rule.title}
className="dashboard-card vault-emerald-tablet p-6"
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
whileHover={{ y: -4 }}
viewport={{ once: true }}
transition={{ duration: 0.4, delay: i * 0.07 }}
>

{rule.image && (
<div className="relative -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-[0.7rem] aspect-[4/3]">
<Image
src={rule.image}
alt={`${rule.title} reference image`}
fill
sizes="(min-width: 1280px) 32vw, (min-width: 768px) 46vw, 92vw"
className="object-cover"
quality={65}
/>
<div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[rgba(5,12,20,0.22)]" />
</div>
)}

<h3 className="text-white/90 mb-3 font-light">
{rule.title}
</h3>

<p className="text-white/60 text-sm leading-relaxed">
{rule.desc}
</p>

</motion.div>

))}

</div>

</div>

</div>

);

}