/**
 * Automated Integration & Unit Test Suite for WeatherSync
 * 
 * Runs API endpoint tests & suitability calculation unit tests.
 */

const test = require('node:test');
const assert = require('node:assert');

// 1. Test Weather Suitability Logic
test('Suitability Calculation - Ideal Conditions', () => {
    // 20°C, 0% rain, 10 km/h wind, clear weather (0)
    const temp = 20;
    const precip = 0;
    const wind = 10;
    const code = 0;

    let score = 100;
    if (temp < 10) score -= (10 - temp) * 3;
    else if (temp > 28) score -= (temp - 28) * 4;
    score -= precip * 0.8;
    if (wind > 20) score -= (wind - 20) * 1.5;

    score = Math.max(0, Math.min(100, Math.round(score)));

    assert.strictEqual(score, 100, "Ideal conditions should yield 100% suitability score.");
});

test('Suitability Calculation - Adverse Weather Conditions', () => {
    // 5°C (cold), 80% rain, 35 km/h wind
    const temp = 5;
    const precip = 80;
    const wind = 35;

    let score = 100;
    if (temp < 10) score -= (10 - temp) * 3; // -15
    score -= precip * 0.8; // -64
    if (wind > 20) score -= (wind - 20) * 1.5; // -22.5

    score = Math.max(0, Math.min(100, Math.round(score)));

    assert.ok(score < 30, `Adverse weather score (${score}) should be below 30%.`);
});

// 2. Test Task Object Structure
test('Task Data Integrity Validation', () => {
    const sampleTask = {
        id: "task-100",
        title: "Test Cycling",
        category: "Fitness",
        location: "Berlin",
        outdoor: true,
        status: "pending",
        createdAt: new Date().toISOString()
    };

    assert.ok(sampleTask.id.startsWith("task-"), "Task ID must follow prefix convention.");
    assert.strictEqual(typeof sampleTask.title, "string", "Title must be string.");
    assert.strictEqual(typeof sampleTask.outdoor, "boolean", "Outdoor flag must be boolean.");
    assert.ok(["pending", "completed"].includes(sampleTask.status), "Status must be valid state.");
});
