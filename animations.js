// //
// // animations.js
// //

// // 1) The class-based approach
// class AnimatedNetwork {
//     constructor(canvasId) {
//       // We expect a <canvas> with this ID in the DOM
//       this.canvas = document.getElementById(canvasId);
//       this.ctx = this.canvas.getContext('2d');
//       this.mouse = { x: 0, y: 0 };
//       this.time = 0;
//       this.points = [];
//       this.CONNECTION_DISTANCE = 120;
//       this.animationFrameId = null;
      
//       // Bind event listeners so `this` remains consistent
//       this.handleMouseMove = this.handleMouseMove.bind(this);
//       this.animate = this.animate.bind(this);
//       this.resizeCanvas = this.resizeCanvas.bind(this);
  
//       // 1) First ensure the canvas is sized properly
//       this.resizeCanvas();
  
//       // 2) Now initialise your points, so they fill the correct canvas size
//       this.initializePoints();
  
//       // 3) Set up event listeners
//       window.addEventListener('resize', this.resizeCanvas);
//       this.canvas.addEventListener('mousemove', this.handleMouseMove);
  
//       // 4) Start the animation
//       this.animate();
//     }
  
//     initializePoints() {
//       // Because resizeCanvas() has already run,
//       // this.canvas.width/height should be correct
//        this.points = Array.from({ length: 80 }, () => ({
//         x: Math.random() * this.canvas.width,
//         y: Math.random() * this.canvas.height,
//         vx: (Math.random() - 0.5) * 1.5,
//         vy: (Math.random() - 0.5) * 1.5,
//         phase: Math.random() * Math.PI * 2,
//         baseSize: 2 + Math.random() * 2,
//         dynamicSize: 0,
//         hue: 210 + Math.random() * 40
//       }));
//     }
  








//     handleMouseMove(e) {
//       const rect = this.canvas.getBoundingClientRect();
//       this.mouse = {
//         x: e.clientX - rect.left,
//         y: e.clientY - rect.top
//       };
//     }
  
//     isValidTriangle(p1, p2, p3) {
//       const d1 = Math.hypot(p1.x - p2.x, p1.y - p2.y);
//       const d2 = Math.hypot(p2.x - p3.x, p2.y - p3.y);
//       const d3 = Math.hypot(p3.x - p1.x, p3.y - p1.y);
//       return (
//         d1 < this.CONNECTION_DISTANCE &&
//         d2 < this.CONNECTION_DISTANCE &&
//         d3 < this.CONNECTION_DISTANCE
//       );
//     }
  
//     getTriangleQuality(p1, p2, p3) {
//       const d1 = Math.hypot(p1.x - p2.x, p1.y - p2.y);
//       const d2 = Math.hypot(p2.x - p3.x, p2.y - p3.y);
//       const d3 = Math.hypot(p3.x - p1.x, p3.y - p1.y);
  
//       // Edge “quality” scaled by distance
//       const edgeQualities = [d1, d2, d3].map(
//         (d) => Math.max(0, 1 - d / this.CONNECTION_DISTANCE)
//       );
//       return Math.min(...edgeQualities) * 0.15; // Max opacity 0.15
//     }
  
//     resizeCanvas() {
//       const dpr = window.devicePixelRatio || 1;
//       const rect = this.canvas.getBoundingClientRect();
//       this.canvas.width = rect.width * dpr;
//       this.canvas.height = rect.height * dpr;
//       this.ctx.scale(dpr, dpr);
//     }
  
//     animate() {
//       this.time += 0.015;
//       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
//       // 1) Calculate connectionCount & proximity
//       this.points.forEach(point => {
//         let connectionCount = 0;
//         let proximityScore = 0;
//         this.points.forEach(otherPoint => {
//           if (point === otherPoint) return;
//           const distance = Math.hypot(point.x - otherPoint.x, point.y - otherPoint.y);
//           if (distance < this.CONNECTION_DISTANCE) {
//             connectionCount++;
//             proximityScore += 1 - distance / this.CONNECTION_DISTANCE;
//           }
//         });
  
//         const connectionScale = Math.min(connectionCount / 10, 2);
//         const proximityScale = Math.min(proximityScore / 5, 1.5);
//         point.dynamicSize = point.baseSize * (1 + connectionScale + proximityScale);
//       });
  
//       // 2) Draw triangles behind
//       for (let i = 0; i < this.points.length - 2; i++) {
//         for (let j = i + 1; j < this.points.length - 1; j++) {
//           for (let k = j + 1; k < this.points.length; k++) {
//             if (this.isValidTriangle(this.points[i], this.points[j], this.points[k])) {
//               const quality = this.getTriangleQuality(
//                 this.points[i],
//                 this.points[j],
//                 this.points[k]
//               );
//               this.ctx.beginPath();
//               this.ctx.moveTo(this.points[i].x, this.points[i].y);
//               this.ctx.lineTo(this.points[j].x, this.points[j].y);
//               this.ctx.lineTo(this.points[k].x, this.points[k].y);
//               this.ctx.closePath();
//               this.ctx.fillStyle = `rgba(65, 105, 225, ${quality})`; // steelblue
//               this.ctx.fill();
//             }
//           }
//         }
//       }
  
//       // 3) Draw line connections
//       this.points.forEach((point, i) => {
//         this.points.slice(i + 1).forEach(otherPoint => {
//           const distance = Math.hypot(point.x - otherPoint.x, point.y - otherPoint.y);
//           if (distance < this.CONNECTION_DISTANCE) {
//             const opacity = (1 - distance / this.CONNECTION_DISTANCE) * 0.3;
//             this.ctx.beginPath();
//             this.ctx.moveTo(point.x, point.y);
//             this.ctx.lineTo(otherPoint.x, otherPoint.y);
//             this.ctx.strokeStyle = `rgba(65, 105, 225, ${opacity})`;
//             this.ctx.lineWidth = (1 - distance / this.CONNECTION_DISTANCE) * 1.5;
//             this.ctx.stroke();
//           }
//         });
//       });
  
//       // 4) Update and draw points
//       this.points.forEach(point => {
//         // Mouse influence
//         const dx = this.mouse.x - point.x;
//         const dy = this.mouse.y - point.y;
//         const dist = Math.hypot(dx, dy);
//         if (dist < 150) {
//           const force = (150 - dist) * 0.0015;
//           point.vx -= dx * force;
//           point.vy -= dy * force;
//         }
  
//         // Wave motion
//         point.x += point.vx;
//         point.y += point.vy + Math.sin(this.time + point.phase) * 0.7;
  
//         // Subtle spiral
//         point.vx += Math.sin(this.time * 0.5 + point.phase) * 0.02;
//         point.vy += Math.cos(this.time * 0.5 + point.phase) * 0.02;
  
//         // Speed limit
//         const speed = Math.hypot(point.vx, point.vy);
//         if (speed > 2) {
//           point.vx = (point.vx / speed) * 2;
//           point.vy = (point.vy / speed) * 2;
//         }
  
//         // Bounce off edges
//         if (point.x < 0 || point.x > this.canvas.width) {
//           point.vx *= -0.8;
//           point.x = point.x < 0 ? 0 : this.canvas.width;
//         }
//         if (point.y < 0 || point.y > this.canvas.height) {
//           point.vy *= -0.8;
//           point.y = point.y < 0 ? 0 : this.canvas.height;
//         }
  
//         // Draw the point
//         this.ctx.beginPath();
//         this.ctx.arc(point.x, point.y, point.dynamicSize, 0, 2 * Math.PI);
//         this.ctx.fillStyle = `hsla(${point.hue}, 80%, 60%, 0.8)`;
//         this.ctx.fill();
//       });
  
//       // Continue animation
//       this.animationFrameId = requestAnimationFrame(this.animate);
//     }
  
//     destroy() {
//       // Remove event listeners & cancel loop
//       window.removeEventListener('resize', this.resizeCanvas);
//       this.canvas.removeEventListener('mousemove', this.handleMouseMove);
//       cancelAnimationFrame(this.animationFrameId);
//     }
//   }
  
//   // 2) A helper function to create a canvas & mount the class
//   let _currentAnimationInstance = null; // store the active instance if needed
  
//   function createAnimatedNetwork(containerId) {
//     const container = document.getElementById(containerId);
//     if (!container) return;
  
//     container.innerHTML = '';
  
//     const canvasId = 'animated-network-canvas';
//     const canvas = document.createElement('canvas');
//     canvas.id = canvasId;
//     canvas.style.width = '100%';
//     canvas.style.height = '100%';
//     container.appendChild(canvas);
  
//     const net = new AnimatedNetwork(canvasId);
//     _currentAnimationInstance = net;
//   }
  
//   // 3) The switcher function
//   function switchAnimation(animationName) {
//     const containerId = 'interactiveContainer';
//     const container = document.getElementById(containerId);
//     if (!container) return;
  
//     // Destroy any existing instance
//     if (_currentAnimationInstance && _currentAnimationInstance.destroy) {
//       _currentAnimationInstance.destroy();
//       _currentAnimationInstance = null;
//     }
  
//     container.innerHTML = '';
  
//     switch (animationName) {
//       case 'animatedNetwork':
//         createAnimatedNetwork(containerId);
//         break;
//       default:
//         // container.textContent = 'No animation selected.';
//         break;
//     }
//   }
  




































// //
// // animations.js
// //

// // 1) The class-based approach
// class AnimatedNetwork {
//     constructor(canvasId) {
//       // We expect a <canvas> with this ID in the DOM
//       this.canvas = document.getElementById(canvasId);
//       this.ctx = this.canvas.getContext('2d');
//       this.mouse = { x: 0, y: 0 };
//       this.time = 0;
//       this.points = [];
//       this.CONNECTION_DISTANCE = 120;
//       this.animationFrameId = null;
      
//       // Bind event listeners so `this` remains consistent
//       this.handleMouseMove = this.handleMouseMove.bind(this);
//       this.animate = this.animate.bind(this);
//       this.resizeCanvas = this.resizeCanvas.bind(this);
  
//       // 1) First ensure the canvas is sized properly
//       this.resizeCanvas();
  
//       // 2) Now initialise your points, so they fill the correct canvas size
//       this.initializePoints();
  
//       // 3) Set up event listeners
//       window.addEventListener('resize', this.resizeCanvas);
//       this.canvas.addEventListener('mousemove', this.handleMouseMove);
  
//       // 4) Start the animation
//       this.animate();
//     }
  
//     initializePoints() {
//       // Because resizeCanvas() has already run,
//       // this.canvas.width/height should be correct
//       this.points = Array.from({ length: 120 }, () => ({
//         x: Math.random() * this.canvas.width,
//         y: Math.random() * this.canvas.height,
//         vx: (Math.random() - 0.5) * 1.5,
//         vy: (Math.random() - 0.5) * 1.5,
//         phase: Math.random() * Math.PI * 2,
//         baseSize: 3 + Math.random() * 5,   // nodes ~3-8 px base size
//         dynamicSize: 0,
//         // For random greyscale:
//         lightness: 20 + Math.random() * 50 // from 20% to 70% grey
//       }));
//     }
  
//     handleMouseMove(e) {
//       const rect = this.canvas.getBoundingClientRect();
//       this.mouse = {
//         x: e.clientX - rect.left,
//         y: e.clientY - rect.top
//       };
//     }
  
//     isValidTriangle(p1, p2, p3) {
//       const d1 = Math.hypot(p1.x - p2.x, p1.y - p2.y);
//       const d2 = Math.hypot(p2.x - p3.x, p2.y - p3.y);
//       const d3 = Math.hypot(p3.x - p1.x, p3.y - p1.y);
//       return (
//         d1 < this.CONNECTION_DISTANCE &&
//         d2 < this.CONNECTION_DISTANCE &&
//         d3 < this.CONNECTION_DISTANCE
//       );
//     }
  
//     getTriangleQuality(p1, p2, p3) {
//       const d1 = Math.hypot(p1.x - p2.x, p1.y - p2.y);
//       const d2 = Math.hypot(p2.x - p3.x, p2.y - p3.y);
//       const d3 = Math.hypot(p3.x - p1.x, p3.y - p1.y);
  
//       // Edge “quality” scaled by distance
//       const edgeQualities = [d1, d2, d3].map(
//         (d) => Math.max(0, 1 - d / this.CONNECTION_DISTANCE)
//       );
//       return Math.min(...edgeQualities) * 0.15; // Max opacity 0.15
//     }
  
//     resizeCanvas() {
//       const dpr = window.devicePixelRatio || 1;
//       const rect = this.canvas.getBoundingClientRect();
//       this.canvas.width = rect.width * dpr;
//       this.canvas.height = rect.height * dpr;
//       this.ctx.scale(dpr, dpr);
//     }
  
//     animate() {
//       this.time += 0.015;
//       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
//       // 1) Calculate connectionCount & proximity
//       this.points.forEach(point => {
//         let connectionCount = 0;
//         let proximityScore = 0;
//         this.points.forEach(otherPoint => {
//           if (point === otherPoint) return;
//           const distance = Math.hypot(point.x - otherPoint.x, point.y - otherPoint.y);
//           if (distance < this.CONNECTION_DISTANCE) {
//             connectionCount++;
//             proximityScore += 1 - distance / this.CONNECTION_DISTANCE;
//           }
//         });
  
//         const connectionScale = Math.min(connectionCount / 10, 2);
//         const proximityScale = Math.min(proximityScore / 5, 1.5);
//         // Keep dynamic resizing:
//         point.dynamicSize = point.baseSize * (1 + connectionScale + proximityScale);
//       });
  
//       // 2) Draw triangles behind
//       for (let i = 0; i < this.points.length - 2; i++) {
//         for (let j = i + 1; j < this.points.length - 1; j++) {
//           for (let k = j + 1; k < this.points.length; k++) {
//             if (this.isValidTriangle(this.points[i], this.points[j], this.points[k])) {
//               const quality = this.getTriangleQuality(
//                 this.points[i],
//                 this.points[j],
//                 this.points[k]
//               );
//               this.ctx.beginPath();
//               this.ctx.moveTo(this.points[i].x, this.points[i].y);
//               this.ctx.lineTo(this.points[j].x, this.points[j].y);
//               this.ctx.lineTo(this.points[k].x, this.points[k].y);
//               this.ctx.closePath();
//               // Grey fill for triangles, same approach or a fixed shade:
//               this.ctx.fillStyle = `rgba(65, 105, 225, ${quality})`; // Or convert to grey if you like
//               this.ctx.fill();
//             }
//           }
//         }
//       }
  
//       // 3) Draw line connections
//       this.points.forEach((point, i) => {
//         this.points.slice(i + 1).forEach(otherPoint => {
//           const distance = Math.hypot(point.x - otherPoint.x, point.y - otherPoint.y);
//           if (distance < this.CONNECTION_DISTANCE) {
//             const opacity = (1 - distance / this.CONNECTION_DISTANCE) * 0.3;
//             this.ctx.beginPath();
//             this.ctx.moveTo(point.x, point.y);
//             this.ctx.lineTo(otherPoint.x, otherPoint.y);
//             // If you want lines also grey, change it here:
//             this.ctx.strokeStyle = `rgba(65, 105, 225, ${opacity})`;
//             this.ctx.lineWidth = (1 - distance / this.CONNECTION_DISTANCE) * 1.5;
//             this.ctx.stroke();
//           }
//         });
//       });
  
//       // 4) Update and draw points
//       this.points.forEach(point => {
//         // Mouse influence
//         const dx = this.mouse.x - point.x;
//         const dy = this.mouse.y - point.y;
//         const dist = Math.hypot(dx, dy);
//         if (dist < 150) {
//           const force = (150 - dist) * 0.0015;
//           point.vx -= dx * force;
//           point.vy -= dy * force;
//         }
  
//         // Wave motion
//         point.x += point.vx;
//         point.y += point.vy + Math.sin(this.time + point.phase) * 0.7;
  
//         // Subtle spiral
//         point.vx += Math.sin(this.time * 0.5 + point.phase) * 0.02;
//         point.vy += Math.cos(this.time * 0.5 + point.phase) * 0.02;
  
//         // Speed limit
//         const speed = Math.hypot(point.vx, point.vy);
//         if (speed > 2) {
//           point.vx = (point.vx / speed) * 2;
//           point.vy = (point.vy / speed) * 2;
//         }
  
//         // Bounce off edges
//         if (point.x < 0 || point.x > this.canvas.width) {
//           point.vx *= -0.8;
//           point.x = point.x < 0 ? 0 : this.canvas.width;
//         }
//         if (point.y < 0 || point.y > this.canvas.height) {
//           point.vy *= -0.8;
//           point.y = point.y < 0 ? 0 : this.canvas.height;
//         }
  
//         // Draw the point
//         // Use random greyscale for node fill:
//         this.ctx.beginPath();
//         this.ctx.arc(point.x, point.y, point.dynamicSize, 0, 2 * Math.PI);
//         this.ctx.fillStyle = `hsl(0, 0%, ${point.lightness}%)`; 
//         this.ctx.fill();
//       });
  
//       // Continue animation
//       this.animationFrameId = requestAnimationFrame(this.animate);
//     }
  
//     destroy() {
//       // Remove event listeners & cancel loop
//       window.removeEventListener('resize', this.resizeCanvas);
//       this.canvas.removeEventListener('mousemove', this.handleMouseMove);
//       cancelAnimationFrame(this.animationFrameId);
//     }
//   }
  
//   // 2) A helper function to create a canvas & mount the class
//   let _currentAnimationInstance = null; // store the active instance if needed
  
//   function createAnimatedNetwork(containerId) {
//     const container = document.getElementById(containerId);
//     if (!container) return;
  
//     container.innerHTML = '';
  
//     const canvasId = 'animated-network-canvas';
//     const canvas = document.createElement('canvas');
//     canvas.id = canvasId;
//     canvas.style.width = '100%';
//     canvas.style.height = '100%';
//     container.appendChild(canvas);
  
//     const net = new AnimatedNetwork(canvasId);
//     _currentAnimationInstance = net;
//   }
  
//   // 3) The switcher function
//   function switchAnimation(animationName) {
//     const containerId = 'interactiveContainer';
//     const container = document.getElementById(containerId);
//     if (!container) return;
  
//     // Destroy any existing instance
//     if (_currentAnimationInstance && _currentAnimationInstance.destroy) {
//       _currentAnimationInstance.destroy();
//       _currentAnimationInstance = null;
//     }
  
//     container.innerHTML = '';
  
//     switch (animationName) {
//       case 'animatedNetwork':
//         createAnimatedNetwork(containerId);
//         break;
//       default:
//         // If you want no message:
//         // container.textContent = 'No animation selected.';
//         break;
//     }
//   }
  















//
// animations.js
//

// 1) The class-based approach
class AnimatedNetwork {
    constructor(canvasId) {
      // We expect a <canvas> with this ID in the DOM
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.mouse = { x: 0, y: 0 };
      this.time = 0;
      this.points = [];
      this.CONNECTION_DISTANCE = 120;
      this.animationFrameId = null;
  
      // Bind event listeners so `this` remains consistent
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.animate = this.animate.bind(this);
      this.resizeCanvas = this.resizeCanvas.bind(this);
  
      // 1) First ensure the canvas is sized properly
      this.resizeCanvas();
  
      // 2) Now initialise your points
      this.initializePoints();
  
      // 3) Event listeners
      window.addEventListener('resize', this.resizeCanvas);
      this.canvas.addEventListener('mousemove', this.handleMouseMove);
  
      // 4) Start animation
      this.animate();
    }
  
    initializePoints() {
      this.points = Array.from({ length: 120 }, () => ({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        phase: Math.random() * Math.PI * 2,
        baseSize: 3 + Math.random() * 5,
        dynamicSize: 0,
        // random greys from 20% to 70% lightness
        lightness: 20 + Math.random() * 50
      }));
    }
  
    handleMouseMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  
    isValidTriangle(p1, p2, p3) {
      const d1 = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      const d2 = Math.hypot(p2.x - p3.x, p2.y - p3.y);
      const d3 = Math.hypot(p3.x - p1.x, p3.y - p1.y);
      return (
        d1 < this.CONNECTION_DISTANCE &&
        d2 < this.CONNECTION_DISTANCE &&
        d3 < this.CONNECTION_DISTANCE
      );
    }
  
    getTriangleQuality(p1, p2, p3) {
      const d1 = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      const d2 = Math.hypot(p2.x - p3.x, p2.y - p3.y);
      const d3 = Math.hypot(p3.x - p1.x, p3.y - p1.y);
      const edgeQualities = [d1, d2, d3].map(
        (d) => Math.max(0, 1 - d / this.CONNECTION_DISTANCE)
      );
      return Math.min(...edgeQualities) * 0.15; // 0 to ~0.15
    }
  
    resizeCanvas() {
      const dpr = window.devicePixelRatio || 1;
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.scale(dpr, dpr);
    }
  
    animate() {
      this.time += 0.015;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      // 1) Calculate connectionCount & proximity
      this.points.forEach(point => {
        let connectionCount = 0;
        let proximityScore = 0;
        this.points.forEach(other => {
          if (point === other) return;
          const dist = Math.hypot(point.x - other.x, point.y - other.y);
          if (dist < this.CONNECTION_DISTANCE) {
            connectionCount++;
            proximityScore += 1 - dist / this.CONNECTION_DISTANCE;
          }
        });
        const connectionScale = Math.min(connectionCount / 10, 2);
        const proximityScale = Math.min(proximityScore / 5, 1.5);
        point.dynamicSize = point.baseSize * (1 + connectionScale + proximityScale);
      });
  
      // 2) Draw triangles (grey shading)
      for (let i = 0; i < this.points.length - 2; i++) {
        for (let j = i + 1; j < this.points.length - 1; j++) {
          for (let k = j + 1; k < this.points.length; k++) {
            if (this.isValidTriangle(this.points[i], this.points[j], this.points[k])) {
              const quality = this.getTriangleQuality(
                this.points[i],
                this.points[j],
                this.points[k]
              );
              // average the 3 nodes' lightness
              const avgLightness = (
                this.points[i].lightness +
                this.points[j].lightness +
                this.points[k].lightness
              ) / 3;
              this.ctx.beginPath();
              this.ctx.moveTo(this.points[i].x, this.points[i].y);
              this.ctx.lineTo(this.points[j].x, this.points[j].y);
              this.ctx.lineTo(this.points[k].x, this.points[k].y);
              this.ctx.closePath();
              // apply alpha = 'quality'
              this.ctx.fillStyle = `hsla(0, 0%, ${avgLightness}%, ${quality})`;
              this.ctx.fill();
            }
          }
        }
      }
  
      // 3) Draw line connections (grey lines)
      this.points.forEach((point, i) => {
        this.points.slice(i + 1).forEach(otherPoint => {
          const distance = Math.hypot(point.x - otherPoint.x, point.y - otherPoint.y);
          if (distance < this.CONNECTION_DISTANCE) {
            const opacity = (1 - distance / this.CONNECTION_DISTANCE) * 0.3;
            // average the two nodes' lightness
            const midLightness = (point.lightness + otherPoint.lightness) / 2;
  
            this.ctx.beginPath();
            this.ctx.moveTo(point.x, point.y);
            this.ctx.lineTo(otherPoint.x, otherPoint.y);
            this.ctx.strokeStyle = `hsla(0, 0%, ${midLightness}%, ${opacity})`;
            this.ctx.lineWidth = (1 - distance / this.CONNECTION_DISTANCE) * 1.5;
            this.ctx.stroke();
          }
        });
      });
  
      // 4) Update and draw points (grey nodes)
      this.points.forEach(point => {
        // Mouse influence
        const dx = this.mouse.x - point.x;
        const dy = this.mouse.y - point.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150) {
          const force = (150 - dist) * 0.0015;
          point.vx -= dx * force;
          point.vy -= dy * force;
        }
  
        // Wave motion
        point.x += point.vx;
        point.y += point.vy + Math.sin(this.time + point.phase) * 0.7;
  
        // Subtle spiral
        point.vx += Math.sin(this.time * 0.5 + point.phase) * 0.02;
        point.vy += Math.cos(this.time * 0.5 + point.phase) * 0.02;
  
        // Speed limit
        const speed = Math.hypot(point.vx, point.vy);
        if (speed > 2) {
          point.vx = (point.vx / speed) * 2;
          point.vy = (point.vy / speed) * 2;
        }
  
        // Bounce off edges
        if (point.x < 0 || point.x > this.canvas.width) {
          point.vx *= -0.8;
          point.x = point.x < 0 ? 0 : this.canvas.width;
        }
        if (point.y < 0 || point.y > this.canvas.height) {
          point.vy *= -0.8;
          point.y = point.y < 0 ? 0 : this.canvas.height;
        }
  
        // Fill with node's own lightness
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, point.dynamicSize, 0, 2 * Math.PI);
        this.ctx.fillStyle = `hsl(0, 0%, ${point.lightness}%)`;
        this.ctx.fill();
      });
  
      // Loop
      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  
    destroy() {
      window.removeEventListener('resize', this.resizeCanvas);
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      cancelAnimationFrame(this.animationFrameId);
    }
  }
  
  // 2) A helper function to create a canvas & mount the class
  let _currentAnimationInstance = null;
  
  function createAnimatedNetwork(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
  
    container.innerHTML = '';
  
    const canvasId = 'animated-network-canvas';
    const canvas = document.createElement('canvas');
    canvas.id = canvasId;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
  
    const net = new AnimatedNetwork(canvasId);
    _currentAnimationInstance = net;
  }
  
  // 3) The switcher function
  function switchAnimation(animationName) {
    const containerId = 'interactiveContainer';
    const container = document.getElementById(containerId);
    if (!container) return;
  
    if (_currentAnimationInstance && _currentAnimationInstance.destroy) {
      _currentAnimationInstance.destroy();
      _currentAnimationInstance = null;
    }
  
    container.innerHTML = '';
  
    switch (animationName) {
      case 'animatedNetwork':
        createAnimatedNetwork(containerId);
        break;
      default:
        // container.textContent = 'No animation selected.';
        break;
    }
  }
  

















