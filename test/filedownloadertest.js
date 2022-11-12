import React from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { expect } from 'chai';
var jsdom = require('mocha-jsdom');
global.document = jsdom({
        url: 'http://localhost:8081'
    });
import App from '../src/App.js';

const arrayFiles = [
    { name: 'smss.exe', device: 'Stark', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe', status: 'scheduled' },
    { name: 'netsh.exe', device: 'Targaryen', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe', status: 'available' },
    { name: 'uxtheme.dll', device: 'Lannister', path: '\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll', status: 'available' },
    { name: 'cryptbase.dll', device: 'Martell', path: '\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll', status: 'scheduled' },
    { name: '7za.exe', device: 'Baratheon', path: '\\Device\\HarddiskVolume1\\temp\\7za.exe', status: 'scheduled' }
];

let container = null;
beforeEach(function() {
    container = document.createElement('div');
    container.id = 'rootcontainer';
    document.body.appendChild(container);
});
afterEach(function() {
    document.body.removeChild(container);
    container = null;
});

describe('File Downloader', function () {
    it('Should render FileDownloader', async function() {
        await act(async () => {
            ReactDOM.createRoot(container).render(<App />);
        });
        
        const checkbox = document.querySelector('#checkbox-select-all');
        expect(checkbox.checked).to.be.false;
    });

    describe('Clicking Select All Checkbox', function() {
        it('Select All Checkbox should check all available files and then uncheck when clicked again', async function() {
            await act(async() => {
                ReactDOM.createRoot(container).render(<App />);
            });
            await act(async() => {
                const selectAllCheckbox = document.querySelector('#checkbox-select-all');
                expect(selectAllCheckbox.checked).to.be.false;
                selectAllCheckbox.dispatchEvent(new window.MouseEvent('click', {bubbles: true}));
            });

            const expectedArrayFiles = arrayFiles.filter((jsonFile) => jsonFile['status'] === 'available');
            const expectedFileNames = expectedArrayFiles.map((jsonFile) => jsonFile['name']);
            const allCheckboxes1 = Array.from(document.getElementsByTagName('input'));
            const checkedCheckboxes1 = allCheckboxes1.filter((checkboxEl) => checkboxEl.id !== 'checkbox-select-all' && checkboxEl.checked);
            
            for (const checkbox of checkedCheckboxes1) {
                const name = checkbox.id.split('-')[1];
                expect(expectedFileNames).to.include(name);
            }

            await act(async() => {
                const selectAllCheckbox = document.querySelector('#checkbox-select-all');
                expect(selectAllCheckbox.checked).to.be.true;
                selectAllCheckbox.dispatchEvent(new window.MouseEvent('click', {bubbles: true}));
            });

            const allCheckboxes2 = Array.from(document.getElementsByTagName('input'));
            const uncheckedCheckboxes2 = allCheckboxes2.filter((checkboxEl) => checkboxEl.id !== 'checkbox-select-all' && !checkboxEl.disabled && !checkboxEl.checked);
            expect(uncheckedCheckboxes2.length).to.equal(expectedArrayFiles.length);
        });
    });
});