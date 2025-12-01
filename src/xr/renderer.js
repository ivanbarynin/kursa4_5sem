import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 50);

export function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    return renderer;
}
