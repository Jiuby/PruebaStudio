import React from 'react';
import { Hero } from '../../components/features/home/Hero';
import { Marquee } from '../../components/features/home/Marquee';
import { LatestDrops } from '../../components/features/home/LatestDrops';

export const Home: React.FC = () => {
    return (
        <>
            <Hero />
            <Marquee />
            <LatestDrops />
        </>
    );
};
