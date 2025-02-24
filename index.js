// The main script for the extension
// The following are examples of some basic extension functionality

//You'll likely need to import extension_settings, getContext, and loadExtensionSettings from extensions.js
import { extension_settings, getContext, loadExtensionSettings } from "../../../extensions.js";

//You'll likely need to import some other functions from the main script
import { saveSettingsDebounced } from "../../../../script.js";

// 扩展名称和路径配置
const extensionName = "st-image-tts";  // 修改为您的扩展名
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const extensionSettings = extension_settings[extensionName];
const defaultSettings = {
    // 默认设置
    image_url: '',
    image_api_key: '',
    image_text_start: '（',
    image_text_end: '）',
    image_size: '512',
    generation_frequency: '5',
    tts_url: '',
    tts_api_key: '',
    tts_text_start: '（',
    tts_text_end: '）',
    playback_speed: '1',
    volume: '1'
};

// 加载扩展设置
async function loadSettings() {
    extension_settings[extensionName] = extension_settings[extensionName] || {};
    if (Object.keys(extension_settings[extensionName]).length === 0) {
        Object.assign(extension_settings[extensionName], defaultSettings);
    }

    // 更新 UI 中的设置
    loadSavedSettings();
}

// 处理图片设置变更
function onImageSettingsInput() {
    const settings = {
        image_url: $('#image_url').val(),
        image_api_key: $('#image_api_key').val(),
        image_size: $('#image_size').val(),
        generation_frequency: $('#generation_frequency').val(),
        image_text_start: $('#image_text_start').val(),
        image_text_end: $('#image_text_end').val()
    };

    Object.assign(extension_settings[extensionName], settings);
    saveSettingsDebounced();
}

// 处理语音设置变更
function onTTSSettingsInput() {
    const settings = {
        tts_url: $('#tts_url').val(),
        tts_api_key: $('#tts_api_key').val(),
        playback_speed: $('#playback_speed').val(),
        volume: $('#volume').val(),
        tts_text_start: $('#tts_text_start').val(),
        tts_text_end: $('#tts_text_end').val()
    };

    Object.assign(extension_settings[extensionName], settings);
    saveSettingsDebounced();
}

// 加载保存的设置到 UI
function loadSavedSettings() {
    const settings = extension_settings[extensionName];
    
    // 图片设置
    $('#image_url').val(settings.image_url);
    $('#image_api_key').val(settings.image_api_key);
    $('#image_size').val(settings.image_size);
    $('#generation_frequency').val(settings.generation_frequency);
    $('#image_text_start').val(settings.image_text_start);
    $('#image_text_end').val(settings.image_text_end);
    
    // 语音设置
    $('#tts_url').val(settings.tts_url);
    $('#tts_api_key').val(settings.tts_api_key);
    $('#playback_speed').val(settings.playback_speed);
    $('#volume').val(settings.volume);
    $('#tts_text_start').val(settings.tts_text_start);
    $('#tts_text_end').val(settings.tts_text_end);
    
    // 更新显示值
    $('#speed_value').text(`${settings.playback_speed}x`);
    $('#volume_value').text(`${Math.round(settings.volume * 100)}%`);
}

// 初始化扩展
jQuery(async () => {
    // 加载 HTML
    const settingsHtml = await $.get(`${extensionFolderPath}/example.html`);
    $("#extensions_settings").append(settingsHtml);

    // 绑定事件监听
    $('#image_url, #image_api_key, #image_size, #generation_frequency, #image_text_start, #image_text_end')
        .on('input', onImageSettingsInput);
    
    $('#tts_url, #tts_api_key, #playback_speed, #volume, #tts_text_start, #tts_text_end')
        .on('input', onTTSSettingsInput);

    // 连接按钮事件
    $('#connect_image').on('click', async () => {
        // 实现连接逻辑
    });

    $('#connect_tts').on('click', async () => {
        // 实现连接逻辑
    });

    // 音色上传按钮事件
    $('#upload_voice').on('click', async () => {
        // 实现上传逻辑
    });

    // 加载设置
    await loadSettings();
});

// 处理生图功能设置
async function loadImageSettings() {
    const url = localStorage.getItem('image_url') || '';
    const apiKey = localStorage.getItem('image_api_key') || '';
    document.getElementById('image_url').value = url;
    document.getElementById('image_api_key').value = apiKey;

    // 加载可用模型
    const models = await fetchAvailableModels();
    const modelSelect = document.getElementById('available_models');
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
    });
}

document.getElementById('save_image_settings').addEventListener('click', () => {
    const url = document.getElementById('image_url').value;
    const apiKey = document.getElementById('image_api_key').value;
    localStorage.setItem('image_url', url);
    localStorage.setItem('image_api_key', apiKey);
});

document.getElementById('connect_image').addEventListener('click', () => {
    // 连接逻辑
});

// 处理语音功能设置
async function loadTTSSettings() {
    const url = localStorage.getItem('tts_url') || '';
    const apiKey = localStorage.getItem('tts_api_key') || '';
    document.getElementById('tts_url').value = url;
    document.getElementById('tts_api_key').value = apiKey;

    // 加载可用模型
    const models = await fetchAvailableModels();
    const modelSelect = document.getElementById('tts_models');
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
    });

    // 加载音色
    const voices = await fetchAvailableVoices();
    const voiceSelect = document.getElementById('voice_selection');
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice;
        option.textContent = voice;
        voiceSelect.appendChild(option);
    });
}

document.getElementById('save_tts_settings').addEventListener('click', () => {
    const url = document.getElementById('tts_url').value;
    const apiKey = document.getElementById('tts_api_key').value;
    localStorage.setItem('tts_url', url);
    localStorage.setItem('tts_api_key', apiKey);
});

document.getElementById('connect_tts').addEventListener('click', () => {
    // 连接逻辑
});

// 处理其他设置
function initializeAdditionalSettings() {
    // 播放速度设置
    const speedSlider = document.getElementById('playback_speed');
    const speedValue = document.getElementById('speed_value');
    
    speedSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        speedValue.textContent = `${value}x`;
        localStorage.setItem('tts_playback_speed', value);
    });
    
    // 音量设置
    const volumeSlider = document.getElementById('volume');
    const volumeValue = document.getElementById('volume_value');
    
    volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        volumeValue.textContent = `${Math.round(value * 100)}%`;
        localStorage.setItem('tts_volume', value);
    });
    
    // 图片大小设置
    const sizeSelect = document.getElementById('image_size');
    sizeSelect.addEventListener('change', (e) => {
        localStorage.setItem('image_size', e.target.value);
    });
    
    // 生成频率限制
    const frequencyInput = document.getElementById('generation_frequency');
    frequencyInput.addEventListener('input', (e) => {
        localStorage.setItem('generation_frequency', e.target.value);
    });
    
    // 加载保存的设置
    loadSavedSettings();
}

function loadSavedSettings() {
    // 加载播放速度
    const savedSpeed = localStorage.getItem('tts_playback_speed') || '1';
    document.getElementById('playback_speed').value = savedSpeed;
    document.getElementById('speed_value').textContent = `${savedSpeed}x`;
    
    // 加载音量
    const savedVolume = localStorage.getItem('tts_volume') || '1';
    document.getElementById('volume').value = savedVolume;
    document.getElementById('volume_value').textContent = `${Math.round(savedVolume * 100)}%`;
    
    // 加载图片大小
    const savedSize = localStorage.getItem('image_size') || '512';
    document.getElementById('image_size').value = savedSize;
    
    // 加载生成频率
    const savedFrequency = localStorage.getItem('generation_frequency') || '5';
    document.getElementById('generation_frequency').value = savedFrequency;
}

// 处理文本截取设置
function initializeTextExtractionSettings() {
    // 加载保存的设置
    const imageStart = localStorage.getItem('image_text_start') || '（';
    const imageEnd = localStorage.getItem('image_text_end') || '）';
    const ttsStart = localStorage.getItem('tts_text_start') || '（';
    const ttsEnd = localStorage.getItem('tts_text_end') || '）';
    
    // 设置初始值
    document.getElementById('image_text_start').value = imageStart;
    document.getElementById('image_text_end').value = imageEnd;
    document.getElementById('tts_text_start').value = ttsStart;
    document.getElementById('tts_text_end').value = ttsEnd;
    
    // 添加事件监听
    document.getElementById('image_text_start').addEventListener('input', (e) => {
        localStorage.setItem('image_text_start', e.target.value);
    });
    document.getElementById('image_text_end').addEventListener('input', (e) => {
        localStorage.setItem('image_text_end', e.target.value);
    });
    document.getElementById('tts_text_start').addEventListener('input', (e) => {
        localStorage.setItem('tts_text_start', e.target.value);
    });
    document.getElementById('tts_text_end').addEventListener('input', (e) => {
        localStorage.setItem('tts_text_end', e.target.value);
    });
}

// 处理音色上传功能
async function initializeVoiceUpload() {
    // 加载可用模型到下拉框
    const models = await fetchAvailableModels();
    const modelSelect = document.getElementById('voice_model');
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
    });
    
    // 处理音色上传
    document.getElementById('upload_voice').addEventListener('click', async () => {
        const model = document.getElementById('voice_model').value;
        const file = document.getElementById('voice_file').files[0];
        const text = document.getElementById('voice_text').value;
        const name = document.getElementById('voice_name').value;
        
        if (!file || !text || !name) {
            toastr.error('请填写所有必要信息');
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append('model', model);
            formData.append('audio', file);
            formData.append('text', text);
            formData.append('name', name);
            
            const response = await fetch('https://api.siliconflow.cn/v1/audio/voices', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('tts_api_key')}`
                },
                body: formData
            });
            
            if (response.ok) {
                toastr.success('音色上传成功');
                // 刷新音色列表
                await loadTTSSettings();
            } else {
                toastr.error('音色上传失败');
            }
        } catch (error) {
            console.error('音色上传错误:', error);
            toastr.error('音色上传出错');
        }
    });
}

// 初始化设置
loadImageSettings();
loadTTSSettings();
