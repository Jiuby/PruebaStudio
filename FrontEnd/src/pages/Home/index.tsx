import React from 'react';
import { Hero } from '../../components/home/Hero';
import { Marquee } from '../../components/home/Marquee';
import { LatestDrops } from '../../components/home/LatestDrops';

export const Home: React.FC = () => {
    return (
        <>
            <Hero />
            <Marquee />
            <LatestDrops />
        </>
    );
};
