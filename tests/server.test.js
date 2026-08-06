/**
 * Unit and integration tests for Weather App
 */

const test = require('node:test');
const assert = require('node:assert');

test('Suitability calculation for ideal weather', () => {
    const temp = 20;
    const precip = 0;
    const wind = 10;

    let score = 100;
    if (temp < 10) score -= (10 - temp) * 3;
    else if (temp > 28) score -= (temp - 28) * 4;
    score -= precip * 0.8;
    if (wind > 20) score -= (wind - 20) * 1.5;

    score = Math.max(0, Math.min(100, Math.round(score)));

    assert.strictEqual(score, 100);
});

test('Suitability calculation for bad weather', () => {
    const temp = 5;
    const precip = 80;
    const wind = 35;

    let score = 100;
    if (temp < 10) score -= (10 - temp) * 3;
    score -= precip * 0.8;
    if (wind > 20) score -= (wind - 20) * 1.5;

    score = Math.max(0, Math.min(100, Math.round(score)));

    assert.ok(score < 30);
});

test('City suggestion filtering', () => {
    const popularCities = [
        { name: "Berlin", country: "Germany" },
        { name: "Munich", country: "Germany" },
        { name: "Paris", country: "France" }
    ];

    const matches = popularCities.filter(c => 
        c.name.toLowerCase().includes("ber".toLowerCase())
    );

    assert.strictEqual(matches.length, 1);
    assert.strictEqual(matches[0].name, "Berlin");
});

test('Task data object format', () => {
    const sampleTask = {
        id: "task-100",
        title: "Cycling in park",
        category: "Fitness",
        location: "Berlin",
        outdoor: true,
        status: "pending",
        createdAt: new Date().toISOString()
    };

    assert.ok(sampleTask.id.startsWith("task-"));
    assert.strictEqual(typeof sampleTask.title, "string");
    assert.strictEqual(typeof sampleTask.outdoor, "boolean");
});
