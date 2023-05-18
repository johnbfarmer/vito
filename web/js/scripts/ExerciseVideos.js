import React from 'react';
import { Grid } from 'semantic-ui-react';
import VitoNav from './VitoNav';

const links = [
    { title: "30 MIN FULL BODY SCULPT:", link: "https://youtu.be/g99aeMOLczE" },
    { title: "10 MIN SIXPACK ABS:", link: "https://youtu.be/QfMlHzgzBwQ" },
    { title: "20 MIN LEG DAY:", link: "https://youtu.be/zZ8tWnE8kzQ" },
    { title: "25 MIN FULL BODY STRETCH:", link: "https://youtu.be/8XNpAg5mDS8" },
    { title: "20 MIN FULL BODY SCULPT:", link: "https://youtu.be/nl7Wdb8qyXY" },
    { title: "5 MIN FULL BODY:", link: "https://youtu.be/exXly1KGEgM" },
    { title: "10 MIN TONED ARMS:", link: "https://youtu.be/Bl9_qRFam4M" },
    { title: "30 MIN FULL BODY STRENGTH:", link: "https://youtu.be/7PUXkkmhvtk" },
    { title: "5 MIN ARMS WITH MUSIC:", link: "https://youtu.be/KC1LEGXHwo8 " },
    { title: "20 MIN BOOTY:", link: "https://youtu.be/5KYAVG7BWAU" },
    { title: "BEGINNER FLEXIBILITY STRETCH:", link: "https://youtu.be/wUHK87X3lkI" },
    { title: "20 MIN FULL BODY:", link: "https://youtu.be/u4XXxbULc84" },
    { title: "10 MIN KILLER HIIT:", link: "https://youtu.be/hA9PVG5ZtRU" },
    { title: "10 MIN TONED ARMS:", link: "https://youtu.be/AsPPDOsCH4A" },
    { title: "30 MIN LOW IMPACT FULL BODY:", link: "https://youtu.be/5LwN80lJvZc" },
    { title: "5 MIN LEAN LEGS:", link: "https://youtu.be/b9DFYywGneA " },
    { title: "30 MIN LEG DAY:", link: "https://youtu.be/ccUElj0LB5A" },
    { title: "20 MIN STRETCH:", link: "https://youtu.be/DYGfwPppgO4" },
    { title: "10 MIN KILLER CORE:", link: "https://youtu.be/Gr1GtwTp_ko " },
    { title: "10 MIN SWEAT SESH:", link: "https://youtu.be/OGilMFGN4eQ" },
    { title: "20 MIN FULL UPPER BODY:", link: "https://youtu.be/xxVRCzT2a1E" },
    { title: "30 MIN FULL BODY:", link: "https://youtu.be/20P92dPLStQ" },
    { title: "10 MIN ABS & YOGA:", link: "https://youtu.be/zFg1ofM93Cs " },
    { title: "10 MIN LEGS & BOOTY:", link: "https://youtu.be/FJA3R7n_594" },
    { title: "20 MIN TOTAL CORE:", link: "https://youtu.be/53B40Aw0k3g " },
    { title: "20 MIN KILLER HIIT:", link: "https://youtu.be/J4wm6qiv5pI" },
    { title: "10 MIN KILLER HIIT:", link: "https://youtu.be/gYgVKHzyHC0" },
    { title: "10 MIN TONED ARMS:", link: "https://youtu.be/pUnCr6CWzOs" },
    { title: "30 MIN FULL BODY SCULPT:", link: "https://youtu.be/r60scOvYn0E" },
    { title: "7 MIN ARMS:", link: "https://youtu.be/8QI6n8JBGh0 " },
    { title: "20 MIN BOOTY:", link: "https://youtu.be/T1cio6MJ7Fs" },
    { title: "PLANK CHALLENGE:", link: "https://youtu.be/z_xEzYVCqWk" },
];


export default class ExerciseVideos extends React.Component {
    render() {
        let lnx = links.map((a,k) => {return(<div key={k}><a href={a.link} target='_blank'>{a.title} {a.link}</a></div>)});
        let r = Math.round(Math.random() * links.length);
        let a = links[r];
        return (
            <div>
                <Grid>
                    <Grid.Column width={3}>
                        <VitoNav chartType='' updateState={()=>{}} />
                    </Grid.Column>
                    <Grid.Column width={13}>
                        <div className='suggested-video'>
                            Today's Suggested Link:
                            <div><a href={a.link} key={a.title} target='_blank'>{a.title} {a.link}</a></div>
                        </div>
                        <div className=''>
                            { lnx }
                        </div>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}
