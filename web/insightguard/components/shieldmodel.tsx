import React, {Suspense, useRef, useState, useEffect} from "react";
import {Canvas, useFrame, useLoader, extend, useThree} from "@react-three/fiber";

import {SVGLoader} from 'three-stdlib'
import {DoubleSide} from "three/src/constants";

import * as THREE from "three";
import {ExtrudeGeometry, Mesh} from "three";

extend(SVGLoader)
extend(THREE.ExtrudeGeometry)

const loader = new SVGLoader()

export function Shield(props) {
    const ref = useRef<Mesh>()
    const [shape, setShape] = useState<ExtrudeGeometry>()

    useFrame((state, delta) => {
        if (ref.current) ref.current.rotation.y += delta
    })

    useEffect(() => {
        loader.load('/shield.svg', (data) => {
            const paths = data.paths
            const shapes = paths.map((path) => path.toShapes(true))
            const shape = shapes[0]

            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: 2,
                bevelEnabled: false
            })
            geometry.center()

            setShape(geometry)
        })
    }, [])

    return (
        <mesh {...props} ref={ref} scale={0.1} rotation={[Math.PI, 0, 0]}>
            <meshBasicMaterial depthWrite={false} color="white" side={DoubleSide}/>
            {shape && <primitive object={shape}/>}
        </mesh>
    )
}
