export interface HotspotConnectionInfo {
    /**
     *      The service set identifier (SSID) of the current 802.11 network.
     */
    SSID: string;
    /**
     *      The basic service set identifier (BSSID) of the current access point.
     */
    BSSID: string;
    /**
     *      The current link speed in Mbps
     */
    linkSpeed: string;
    /**
     *      The IP Address
     */
    IPAddress: string;
    /**
     *      Each configured network has a unique small integer ID, used to identify the network when performing operations on the supplicant.
     */
    networkID: string;
}
export interface HotspotNetwork {
    /**
     *      Human readable network name
     */
    SSID: string;
    /**
     *      MAC Address of the access point
     */
    BSSID: string;
    /**
     *      The primary 20 MHz frequency (in MHz) of the channel over which the client is communicating with the access point.
     */
    frequency: number;
    /**
     *      The detected signal level in dBm, also known as the RSSI.
     */
    level: number;
    /**
     *      Timestamp in microseconds (since boot) when this result was last seen.
     */
    timestamp: number;
    /**
     *      Describes the authentication, key management, and encryption schemes supported by the access point.
     */
    capabilities: string;
}
export interface HotspotNetworkConfig {
    /**
     *   Device IP Address
     */
    deviceIPAddress: string;
    /**
     *   Device MAC Address
     */
    deviceMacAddress: string;
    /**
     *   Gateway IP Address
     */
    gatewayIPAddress: string;
    /**
     *   Gateway MAC Address
     */
    gatewayMacAddress: string;
}
export interface HotspotDevice {
    /**
     *   ip
     *      Hotspot IP Address
     */
    ip: string;
    /**
     *   mac
     *      Hotspot MAC Address
     */
    mac: string;
}
/**
 * @beta
 * @name Hotspot
 * @description
 * @usage
 * ```typescript
 * import { Hotspot, Network } from 'ionic-native';
 *
 *
 * Hotspot.scanWifi().then((networks: Array<Network>) => {
 *     console.log(networks);
 * });
 *
 * ```
 * @interfaces
 * HotspotConnectionInfo
 * HotspotNetwork
 * HotspotNetworkConfig
 * HotspotDevice
 */
export declare class Hotspot {
    /**
     * @returns {Promise<boolean>}
     */
    static isAvailable(): Promise<boolean>;
    /**
     * @returns {Promise<boolean>}
     */
    static toggleWifi(): Promise<boolean>;
    /**
     * Configures and starts hotspot with SSID and Password
     *
     * @param {string}    SSID        - SSID of your new Access Point
     * @param {string}    mode        - encryption mode (Open, WEP, WPA, WPA_PSK)
     * @param {string}    password    - password for your new Access Point
     *
     * @returns {Promise<void>}        - Promise to call once hotspot is started, or reject upon failure
     */
    static createHotspot(ssid: string, mode: string, password: string): Promise<void>;
    /**
     * Turns on Access Point
     *
     * @returns {Promise<boolean>} - true if AP is started
     */
    static startHotspot(): Promise<boolean>;
    /**
     * Configures hotspot with SSID and Password
     *
     * @param {string}    SSID        - SSID of your new Access Point
     * @param {string}    mode        - encryption mode (Open, WEP, WPA, WPA_PSK)
     * @param {string}    password    - password for your new Access Point
     *
     * @returns {Promise<void>}        - Promise to call when hotspot is configured, or reject upon failure
     */
    static configureHotspot(ssid: string, mode: string, password: string): Promise<void>;
    /**
     * Turns off Access Point
     *
     * @returns {Promise<boolean>} - Promise to turn off the hotspot, true on success, false on failure
     */
    static stopHotspot(): Promise<boolean>;
    /**
     * Checks if hotspot is enabled
     *
     * @returns {Promise<void>}    - Promise that hotspot is enabled, rejected if it is not enabled
     */
    static isHotspotEnabled(): Promise<void>;
    /**
     * @returns {Promise<Array<HotspotDevice>>}
     */
    static getAllHotspotDevices(): Promise<Array<HotspotDevice>>;
    /**
     * Connect to a WiFi network
     *
     * @param {string}    ssid
     *      SSID to connect
     * @param {string}    password
     *      password to use
     *
     * @returns {Promise<void>}
     *      Promise that connection to the WiFi network was successfull, rejected if unsuccessful
     */
    static connectToWifi(ssid: string, password: string): Promise<void>;
    /**
     * Connect to a WiFi network
     *
     * @param {string}   ssid
     *      SSID to connect
     * @param {string}   password
     *      Password to use
     * @param {string}   authentication
     *      Authentication modes to use (LEAP, SHARED, OPEN)
     * @param {string[]} encryption
     *      Encryption modes to use (CCMP, TKIP, WEP104, WEP40)
     *
     * @returns {Promise<void>}
     *      Promise that connection to the WiFi network was successfull, rejected if unsuccessful
     */
    static connectToWifiAuthEncrypt(ssid: string, password: string, authentication: string, encryption: Array<string>): Promise<void>;
    /**
     * Add a WiFi network
     *
     * @param {string}    ssid
     *      SSID of network
     * @param {string}    mode
     *      Authentication mode of (Open, WEP, WPA, WPA_PSK)
     * @param {string}    password
     *      Password for network
     *
     * @returns {Promise<void>}
     *      Promise that adding the WiFi network was successfull, rejected if unsuccessful
     */
    static addWifiNetwork(ssid: string, mode: string, password: string): Promise<void>;
    /**
     * Remove a WiFi network
     *
     * @param {string}    ssid
     *      SSID of network
     *
     * @returns {Promise<void>}
     *      Promise that removing the WiFi network was successfull, rejected if unsuccessful
     */
    static removeWifiNetwork(ssid: string): Promise<void>;
    /**
     * @returns {Promise<boolean>}
     */
    static isConnectedToInternet(): Promise<boolean>;
    /**
     * @returns {Promise<boolean>}
     */
    static isConnectedToInternetViaWifi(): Promise<boolean>;
    /**
     * @returns {Promise<boolean>}
     */
    static isWifiOn(): Promise<boolean>;
    /**
     * @returns {Promise<boolean>}
     */
    static isWifiSupported(): Promise<boolean>;
    /**
     * @returns {Promise<boolean>}
     */
    static isWifiDirectSupported(): Promise<boolean>;
    /**
     * @returns {Promise<Array<HotspotNetwork>>}
     */
    static scanWifi(): Promise<Array<HotspotNetwork>>;
    /**
     * @returns {Promise<Array<HotspotNetwork>>}
     */
    static scanWifiByLevel(): Promise<Array<HotspotNetwork>>;
    /**
     * @returns {Promise<any>}
     */
    static startWifiPeriodicallyScan(interval: number, duration: number): Promise<any>;
    /**
     * @returns {Promise<any>}
     */
    static stopWifiPeriodicallyScan(): Promise<any>;
    /**
     * @returns {Promise<HotspotNetworkConfig>}
     */
    static getNetConfig(): Promise<HotspotNetworkConfig>;
    /**
     * @returns {Promise<HotspotConnectionInfo>}
     */
    static getConnectionInfo(): Promise<HotspotConnectionInfo>;
    /**
     * @returns {Promise<string>}
     */
    static pingHost(ip: string): Promise<string>;
    /**
     * Gets MAC Address associated with IP Address from ARP File
     *
     * @param {string}        ip  - IP Address that you want the MAC Address of
     *
     * @returns {Promise<string>}  - A Promise for the MAC Address
     */
    static getMacAddressOfHost(ip: string): Promise<string>;
    /**
     * Checks if IP is live using DNS
     *
     * @param {string}        ip  - IP Address you want to test
     *
     * @returns {Promise<boolean>} - A Promise for whether the IP Address is reachable
     */
    static isDnsLive(ip: string): Promise<boolean>;
    /**
     * Checks if IP is live using socket And PORT
     *
     * @param {string}        ip  - IP Address you want to test
     *
     * @returns {Promise<boolean>} - A Promise for whether the IP Address is reachable
     */
    static isPortLive(ip: string): Promise<boolean>;
    /**
     * Checks if device is rooted
     *
     * @returns {Promise<boolean>} - A Promise for whether the device is rooted
     */
    static isRooted(): Promise<boolean>;
}
