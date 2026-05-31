fetch("http://localhost:3001/shipments?filter=productId='f3312be4-9c19-4b56-965d-f4523e7ce08a'").then(r=>r.json()).then(console.log);
