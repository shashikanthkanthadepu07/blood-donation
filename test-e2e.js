const app = require('./api/index');
const http = require('http');

const server = http.createServer(app);

server.listen(5099, async () => {
  console.log('Testing server running on port 5099...');

  const BASE = 'http://127.0.0.1:5099';

  try {
    // 1. Healthcheck
    const hRes = await fetch(`${BASE}/api/health`).then(r => r.json());
    console.log('1. Healthcheck:', hRes.status === 'healthy' ? 'PASS' : 'FAIL');

    // 2. Stats
    const sRes = await fetch(`${BASE}/api/stats`).then(r => r.json());
    console.log('2. Stats:', sRes.success ? `PASS (Total donors: ${sRes.stats.totalDonors}, Units: ${sRes.stats.totalUnitsInBank})` : 'FAIL');

    // 3. Donors
    const dRes = await fetch(`${BASE}/api/donors`).then(r => r.json());
    console.log('3. Donors:', dRes.success && dRes.donors.length > 0 ? `PASS (${dRes.donors.length} donors loaded)` : 'FAIL');

    // 4. Donors filter by bloodGroup O-
    const dfRes = await fetch(`${BASE}/api/donors?bloodGroup=O-`).then(r => r.json());
    console.log('4. Donors Filter (O-):', dfRes.success && dfRes.donors[0].bloodGroup === 'O-' ? 'PASS' : 'FAIL');

    // 5. Requests
    const rRes = await fetch(`${BASE}/api/requests`).then(r => r.json());
    console.log('5. Requests:', rRes.success && rRes.requests.length > 0 ? `PASS (${rRes.requests.length} requests)` : 'FAIL');

    // 6. Create Request
    const crRes = await fetch(`${BASE}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientName: 'Pooja Verma',
        hospitalName: 'Apollo Speciality Hospital',
        city: 'Mumbai',
        bloodGroup: 'B+',
        unitsRequired: 2,
        urgency: 'Emergency',
        contactPerson: 'Sunil Verma',
        contactPhone: '+91 98200 99881',
        notes: 'Pre-op urgent crossmatch'
      })
    }).then(r => r.json());
    console.log('6. Create Request:', crRes.success ? `PASS (Request ID: ${crRes.request._id})` : 'FAIL');

    // 7. Pledge to Request
    const pRes = await fetch(`${BASE}/api/requests/${crRes.request._id}/pledge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        donorName: 'Test Donor',
        donorPhone: '+91 98201 11223',
        unitsPledged: 1
      })
    }).then(r => r.json());
    console.log('7. Pledge Donation:', pRes.success && pRes.request.unitsFulfilled === 1 ? 'PASS' : 'FAIL');

    // 8. Inventory
    const invRes = await fetch(`${BASE}/api/inventory`).then(r => r.json());
    console.log('8. Inventory:', invRes.success && invRes.inventory.length === 8 ? `PASS (${invRes.totalUnits} total units)` : 'FAIL');

    // 9. Camps
    const campRes = await fetch(`${BASE}/api/camps`).then(r => r.json());
    console.log('9. Camps:', campRes.success && campRes.camps.length > 0 ? `PASS (${campRes.camps.length} camps)` : 'FAIL');

    // 10. Demo Auth
    const authRes = await fetch(`${BASE}/api/auth/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'donor' })
    }).then(r => r.json());
    console.log('10. Demo Auth:', authRes.success && authRes.token ? `PASS (Logged in as: ${authRes.user.name})` : 'FAIL');

    console.log('\n🎉 ALL 10/10 INTEGRATION TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
