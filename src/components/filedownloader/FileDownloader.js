import React, { useState, useEffect, useRef } from 'react';
import './FileDownloader.css';

const fetchListOfFiles = () => {
    const arrayFiles = [
        { name: 'smss.exe', device: 'Stark', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe', status: 'scheduled' },
        { name: 'netsh.exe', device: 'Targaryen', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe', status: 'available' },
        { name: 'uxtheme.dll', device: 'Lannister', path: '\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll', status: 'available' },
        { name: 'cryptbase.dll', device: 'Martell', path: '\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll', status: 'scheduled' },
        { name: '7za.exe', device: 'Baratheon', path: '\\Device\\HarddiskVolume1\\temp\\7za.exe', status: 'scheduled' }
    ];
    return arrayFiles;
}

const FileDownloader = () => {
    const [originalFilesForDownload, setOriginalFilesForDownload] = useState([]);
    const [lookupFilesForDownload, setLookupFilesForDownload] = useState({});
    const selectAllCheckboxRef = useRef();

    // ========================================================================
    // Fetch files
    // ========================================================================
    useEffect(() => {
        const arrayFiles = fetchListOfFiles();
        setOriginalFilesForDownload(arrayFiles);

        // Create map of files with checkbox states
        const lookupFiles = {};
        for (const jsonFile of arrayFiles) {
            lookupFiles[jsonFile['name']] = {...jsonFile, checked: false};
        }
        setLookupFilesForDownload(lookupFiles);
    }, []);

    // ========================================================================
    // Event handlers
    // ========================================================================
    const onChangeSelectAllCheckbox = (e) => {
        const selectAllChecked = e.target.checked;
        const numCheckedItems = Object.values(lookupFilesForDownload).filter((jsonFile) => {
            return jsonFile['checked'] && jsonFile['status'] === 'available';
        }).length;
        const numAvailableItems = Object.values(lookupFilesForDownload).filter((jsonFile) => jsonFile['status'] === 'available').length;

        if (numCheckedItems < numAvailableItems) {
            selectAllCheckboxRef.current.checked = true;
            selectAllCheckboxRef.current.indeterminate = false;
        }
        else {
            selectAllCheckboxRef.current.checked = false;
            selectAllCheckboxRef.current.indeterminate = false;
        }

        for (const fileName in lookupFilesForDownload) {
            if (lookupFilesForDownload[fileName]['status'] !== 'available') continue;
            lookupFilesForDownload[fileName]['checked'] = selectAllChecked;
        }
        setLookupFilesForDownload({...lookupFilesForDownload});
    };

    const onChangeFileCheckbox = (jsonFile, e) => {
        lookupFilesForDownload[jsonFile['name']]['checked'] = e.target.checked;

        const numCheckedItems = Object.values(lookupFilesForDownload).filter((jsonFile) => {
            return jsonFile['checked'] && jsonFile['status'] === 'available';
        }).length;
        const numAvailableItems = Object.values(lookupFilesForDownload).filter((jsonFile) => jsonFile['status'] === 'available').length;

        if (numCheckedItems === 0) {
            selectAllCheckboxRef.current.checked = false;
            selectAllCheckboxRef.current.indeterminate = false;
        }
        else if (numCheckedItems === numAvailableItems) {
            selectAllCheckboxRef.current.checked = true;
            selectAllCheckboxRef.current.indeterminate = false;
        }
        else {
            selectAllCheckboxRef.current.checked = false;
            selectAllCheckboxRef.current.indeterminate = true;
        }

        setLookupFilesForDownload({...lookupFilesForDownload});
    };

    const onClickDownloadSelected = () => {
        let alertMessage = '';
        for (const fileName in lookupFilesForDownload) {
            if (lookupFilesForDownload[fileName]['status'] === 'available' && lookupFilesForDownload[fileName]['checked']) {
                const device = lookupFilesForDownload[fileName]['device'];
                const path = lookupFilesForDownload[fileName]['path'];
                alertMessage += `[${device}] : ${path}\n`;
            }
        }
        alert(alertMessage);
    };

    // ========================================================================
    // Prepare/update Headers and Operations
    // ========================================================================
    let headerNames = [];
    if (originalFilesForDownload.length > 0) {
        const jsonFirstFile = originalFilesForDownload[0];
        const keys = Object.keys(jsonFirstFile).map((k) => {
            return k[0].toUpperCase() + k.slice(1)
        });
        headerNames = keys;
    }
    const numCheckedItems = Object.values(lookupFilesForDownload).filter((jsonFile) => {
        return jsonFile['checked'];
    }).length;
    const selectAllCheckboxText = (numCheckedItems > 0) ? `Selected ${numCheckedItems}` : 'None Selected';

    // ========================================================================
    // Render
    // ========================================================================
    return (
        <div className="file-downloader-flex-container">
            {/* Operations */}
            <div className="file-downloader-flex-operations">
                <input type="checkbox" id="checkbox-select-all" ref={selectAllCheckboxRef}
                    onChange={(e) => onChangeSelectAllCheckbox(e)}/>
                <label htmlFor="checkbox-select-all">{selectAllCheckboxText}</label>
                <button type="button" disabled={numCheckedItems === 0} onClick={() => onClickDownloadSelected()}>Download Selected</button>
            </div>

            <div role="grid">
                {/* Header */}
                <div className="file-downloader-flex-header" role="row">
                    <div></div>
                    {headerNames.map((header) => (
                        <p key={header} role="columnheader">{header}</p>
                    ))}
                </div>

                {/* Content */}
                {Object.values(lookupFilesForDownload).map((jsonFile, index) => (
                    <div className={`file-downloader-flex-row ${jsonFile['checked'] ? 'selected-row' : ''}`} key={jsonFile['name']} role="row">
                        <input type="checkbox" id={'checkbox-' + jsonFile['name']} disabled={jsonFile['status'] !== 'available'} checked={jsonFile['checked']} 
                            onChange={(e) => onChangeFileCheckbox(jsonFile, e)} role="gridcell"/>
                        <label htmlFor={'checkbox-' + jsonFile['name']} role="gridcell">{jsonFile['name']}</label>
                        <p role="gridcell">{jsonFile['device']}</p>
                        <p role="gridcell">{jsonFile['path']}</p>
                        <p role="gridcell">{jsonFile['status'] === 'available' && <span className="status-indicator"></span>} {jsonFile['status'][0].toUpperCase() + jsonFile['status'].slice(1)}</p>
                    </div>
                ))}
            </div>
            
        </div>
    );
}

export default FileDownloader;