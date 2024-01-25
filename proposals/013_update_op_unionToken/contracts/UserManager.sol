/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
// OpenZeppelin Contracts (last updated v4.6.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * ////IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (utils/Address.sol)

pragma solidity ^0.8.1;

/**
 * @dev Collection of functions related to the address type
 */
library AddressUpgradeable {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [////IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     *
     * [IMPORTANT]
     * ====
     * You shouldn't rely on `isContract` to protect against flash loan attacks!
     *
     * Preventing calls from contracts is highly discouraged. It breaks composability, breaks support for smart wallets
     * like Gnosis Safe, and does not provide security since it can be circumvented by calling from a contract
     * constructor.
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // This method relies on extcodesize/address.code.length, which returns 0
        // for contracts in construction, since the code is only stored at the end
        // of the constructor execution.

        return account.code.length > 0;
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * ////IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason, it is bubbled up by this
     * function (like regular Solidity function calls).
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     *
     * _Available since v3.1._
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, "Address: low-level call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with
     * `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    /**
     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but
     * with `errorMessage` as a fallback revert reason when `target` reverts.
     *
     * _Available since v3.1._
     */
    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        return functionStaticCall(target, data, "Address: low-level static call failed");
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a static call.
     *
     * _Available since v3.3._
     */
    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata, errorMessage);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and revert (either by bubbling
     * the revert reason or using the provided one) in case of unsuccessful call or if target was not a contract.
     *
     * _Available since v4.8._
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        if (success) {
            if (returndata.length == 0) {
                // only check isContract if the call was successful and the return data is empty
                // otherwise we already know that it was a contract
                require(isContract(target), "Address: call to non-contract");
            }
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and revert if it wasn't, either by bubbling the
     * revert reason or using the provided one.
     *
     * _Available since v4.3._
     */
    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    function _revert(bytes memory returndata, string memory errorMessage) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert(errorMessage);
        }
    }
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
// OpenZeppelin Contracts (last updated v4.8.1) (proxy/utils/Initializable.sol)

pragma solidity ^0.8.2;

////import "../../utils/AddressUpgradeable.sol";

/**
 * @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
 * behind a proxy. Since proxied contracts do not make use of a constructor, it's common to move constructor logic to an
 * external initializer function, usually called `initialize`. It then becomes necessary to protect this initializer
 * function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.
 *
 * The initialization functions use a version number. Once a version number is used, it is consumed and cannot be
 * reused. This mechanism prevents re-execution of each "step" but allows the creation of new initialization steps in
 * case an upgrade adds a module that needs to be initialized.
 *
 * For example:
 *
 * [.hljs-theme-light.nopadding]
 * ```
 * contract MyToken is ERC20Upgradeable {
 *     function initialize() initializer public {
 *         __ERC20_init("MyToken", "MTK");
 *     }
 * }
 * contract MyTokenV2 is MyToken, ERC20PermitUpgradeable {
 *     function initializeV2() reinitializer(2) public {
 *         __ERC20Permit_init("MyToken");
 *     }
 * }
 * ```
 *
 * TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
 * possible by providing the encoded function call as the `_data` argument to {ERC1967Proxy-constructor}.
 *
 * CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
 * that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.
 *
 * [CAUTION]
 * ====
 * Avoid leaving a contract uninitialized.
 *
 * An uninitialized contract can be taken over by an attacker. This applies to both a proxy and its implementation
 * contract, which may impact the proxy. To prevent the implementation contract from being used, you should invoke
 * the {_disableInitializers} function in the constructor to automatically lock it when it is deployed:
 *
 * [.hljs-theme-light.nopadding]
 * ```
 * /// @custom:oz-upgrades-unsafe-allow constructor
 * constructor() {
 *     _disableInitializers();
 * }
 * ```
 * ====
 */
abstract contract Initializable {
    /**
     * @dev Indicates that the contract has been initialized.
     * @custom:oz-retyped-from bool
     */
    uint8 private _initialized;

    /**
     * @dev Indicates that the contract is in the process of being initialized.
     */
    bool private _initializing;

    /**
     * @dev Triggered when the contract has been initialized or reinitialized.
     */
    event Initialized(uint8 version);

    /**
     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
     * `onlyInitializing` functions can be used to initialize parent contracts.
     *
     * Similar to `reinitializer(1)`, except that functions marked with `initializer` can be nested in the context of a
     * constructor.
     *
     * Emits an {Initialized} event.
     */
    modifier initializer() {
        bool isTopLevelCall = !_initializing;
        require(
            (isTopLevelCall && _initialized < 1) ||
                (!AddressUpgradeable.isContract(address(this)) && _initialized == 1),
            "Initializable: contract is already initialized"
        );
        _initialized = 1;
        if (isTopLevelCall) {
            _initializing = true;
        }
        _;
        if (isTopLevelCall) {
            _initializing = false;
            emit Initialized(1);
        }
    }

    /**
     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
     * used to initialize parent contracts.
     *
     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
     * are added through upgrades and that require initialization.
     *
     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
     * cannot be nested. If one is invoked in the context of another, execution will revert.
     *
     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
     * a contract, executing them in the right order is up to the developer or operator.
     *
     * WARNING: setting the version to 255 will prevent any future reinitialization.
     *
     * Emits an {Initialized} event.
     */
    modifier reinitializer(uint8 version) {
        require(!_initializing && _initialized < version, "Initializable: contract is already initialized");
        _initialized = version;
        _initializing = true;
        _;
        _initializing = false;
        emit Initialized(version);
    }

    /**
     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
     * {initializer} and {reinitializer} modifiers, directly or indirectly.
     */
    modifier onlyInitializing() {
        require(_initializing, "Initializable: contract is not initializing");
        _;
    }

    /**
     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
     * through proxies.
     *
     * Emits an {Initialized} event the first time it is successfully executed.
     */
    function _disableInitializers() internal virtual {
        require(!_initializing, "Initializable: contract is initializing");
        if (_initialized < type(uint8).max) {
            _initialized = type(uint8).max;
            emit Initialized(type(uint8).max);
        }
    }

    /**
     * @dev Returns the highest version that has been initialized. See {reinitializer}.
     */
    function _getInitializedVersion() internal view returns (uint8) {
        return _initialized;
    }

    /**
     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
     */
    function _isInitializing() internal view returns (bool) {
        return _initializing;
    }
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (utils/StorageSlot.sol)

pragma solidity ^0.8.0;

/**
 * @dev Library for reading and writing primitive types to specific storage slots.
 *
 * Storage slots are often used to avoid storage conflict when dealing with upgradeable contracts.
 * This library helps with reading and writing to such slots without the need for inline assembly.
 *
 * The functions in this library return Slot structs that contain a `value` member that can be used to read or write.
 *
 * Example usage to set ERC1967 implementation slot:
 * ```
 * contract ERC1967 {
 *     bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
 *
 *     function _getImplementation() internal view returns (address) {
 *         return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
 *     }
 *
 *     function _setImplementation(address newImplementation) internal {
 *         require(Address.isContract(newImplementation), "ERC1967: new implementation is not a contract");
 *         StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
 *     }
 * }
 * ```
 *
 * _Available since v4.1 for `address`, `bool`, `bytes32`, and `uint256`._
 */
library StorageSlotUpgradeable {
    struct AddressSlot {
        address value;
    }

    struct BooleanSlot {
        bool value;
    }

    struct Bytes32Slot {
        bytes32 value;
    }

    struct Uint256Slot {
        uint256 value;
    }

    /**
     * @dev Returns an `AddressSlot` with member `value` located at `slot`.
     */
    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `BooleanSlot` with member `value` located at `slot`.
     */
    function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `Bytes32Slot` with member `value` located at `slot`.
     */
    function getBytes32Slot(bytes32 slot) internal pure returns (Bytes32Slot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }

    /**
     * @dev Returns an `Uint256Slot` with member `value` located at `slot`.
     */
    function getUint256Slot(bytes32 slot) internal pure returns (Uint256Slot storage r) {
        /// @solidity memory-safe-assembly
        assembly {
            r.slot := slot
        }
    }
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
// OpenZeppelin Contracts (last updated v4.5.0) (interfaces/draft-IERC1822.sol)

pragma solidity ^0.8.0;

/**
 * @dev ERC1822: Universal Upgradeable Proxy Standard (UUPS) documents a method for upgradeability through a simplified
 * proxy whose upgrades are fully controlled by the current implementation.
 */
interface IERC1822ProxiableUpgradeable {
    /**
     * @dev Returns the storage slot that the proxiable contract assumes is being used to store the implementation
     * address.
     *
     * ////IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks
     * bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this
     * function revert if invoked through a proxy.
     */
    function proxiableUUID() external view returns (bytes32);
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
// OpenZeppelin Contracts v4.4.1 (proxy/beacon/IBeacon.sol)

pragma solidity ^0.8.0;

/**
 * @dev This is the interface that {BeaconProxy} expects of its beacon.
 */
interface IBeaconUpgradeable {
    /**
     * @dev Must return an address that can be used as a delegate call target.
     *
     * {BeaconProxy} will check that this address is a contract.
     */
    function implementation() external view returns (address);
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
// OpenZeppelin Contracts (last updated v4.5.0) (proxy/ERC1967/ERC1967Upgrade.sol)

pragma solidity ^0.8.2;

////import "../beacon/IBeaconUpgradeable.sol";
////import "../../interfaces/draft-IERC1822Upgradeable.sol";
////import "../../utils/AddressUpgradeable.sol";
////import "../../utils/StorageSlotUpgradeable.sol";
////import "../utils/Initializable.sol";

/**
 * @dev This abstract contract provides getters and event emitting update functions for
 * https://eips.ethereum.org/EIPS/eip-1967[EIP1967] slots.
 *
 * _Available since v4.1._
 *
 * @custom:oz-upgrades-unsafe-allow delegatecall
 */
abstract contract ERC1967UpgradeUpgradeable is Initializable {
    function __ERC1967Upgrade_init() internal onlyInitializing {}

    function __ERC1967Upgrade_init_unchained() internal onlyInitializing {}

    // This is the keccak-256 hash of "eip1967.proxy.rollback" subtracted by 1
    bytes32 private constant _ROLLBACK_SLOT = 0x4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143;

    /**
     * @dev Storage slot with the address of the current implementation.
     * This is the keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1, and is
     * validated in the constructor.
     */
    bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    /**
     * @dev Emitted when the implementation is upgraded.
     */
    event Upgraded(address indexed implementation);

    /**
     * @dev Returns the current implementation address.
     */
    function _getImplementation() internal view returns (address) {
        return StorageSlotUpgradeable.getAddressSlot(_IMPLEMENTATION_SLOT).value;
    }

    /**
     * @dev Stores a new address in the EIP1967 implementation slot.
     */
    function _setImplementation(address newImplementation) private {
        require(AddressUpgradeable.isContract(newImplementation), "ERC1967: new implementation is not a contract");
        StorageSlotUpgradeable.getAddressSlot(_IMPLEMENTATION_SLOT).value = newImplementation;
    }

    /**
     * @dev Perform implementation upgrade
     *
     * Emits an {Upgraded} event.
     */
    function _upgradeTo(address newImplementation) internal {
        _setImplementation(newImplementation);
        emit Upgraded(newImplementation);
    }

    /**
     * @dev Perform implementation upgrade with additional setup call.
     *
     * Emits an {Upgraded} event.
     */
    function _upgradeToAndCall(
        address newImplementation,
        bytes memory data,
        bool forceCall
    ) internal {
        _upgradeTo(newImplementation);
        if (data.length > 0 || forceCall) {
            _functionDelegateCall(newImplementation, data);
        }
    }

    /**
     * @dev Perform implementation upgrade with security checks for UUPS proxies, and additional setup call.
     *
     * Emits an {Upgraded} event.
     */
    function _upgradeToAndCallUUPS(
        address newImplementation,
        bytes memory data,
        bool forceCall
    ) internal {
        // Upgrades from old implementations will perform a rollback test. This test requires the new
        // implementation to upgrade back to the old, non-ERC1822 compliant, implementation. Removing
        // this special case will break upgrade paths from old UUPS implementation to new ones.
        if (StorageSlotUpgradeable.getBooleanSlot(_ROLLBACK_SLOT).value) {
            _setImplementation(newImplementation);
        } else {
            try IERC1822ProxiableUpgradeable(newImplementation).proxiableUUID() returns (bytes32 slot) {
                require(slot == _IMPLEMENTATION_SLOT, "ERC1967Upgrade: unsupported proxiableUUID");
            } catch {
                revert("ERC1967Upgrade: new implementation is not UUPS");
            }
            _upgradeToAndCall(newImplementation, data, forceCall);
        }
    }

    /**
     * @dev Storage slot with the admin of the contract.
     * This is the keccak-256 hash of "eip1967.proxy.admin" subtracted by 1, and is
     * validated in the constructor.
     */
    bytes32 internal constant _ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

    /**
     * @dev Emitted when the admin account has changed.
     */
    event AdminChanged(address previousAdmin, address newAdmin);

    /**
     * @dev Returns the current admin.
     */
    function _getAdmin() internal view returns (address) {
        return StorageSlotUpgradeable.getAddressSlot(_ADMIN_SLOT).value;
    }

    /**
     * @dev Stores a new address in the EIP1967 admin slot.
     */
    function _setAdmin(address newAdmin) private {
        require(newAdmin != address(0), "ERC1967: new admin is the zero address");
        StorageSlotUpgradeable.getAddressSlot(_ADMIN_SLOT).value = newAdmin;
    }

    /**
     * @dev Changes the admin of the proxy.
     *
     * Emits an {AdminChanged} event.
     */
    function _changeAdmin(address newAdmin) internal {
        emit AdminChanged(_getAdmin(), newAdmin);
        _setAdmin(newAdmin);
    }

    /**
     * @dev The storage slot of the UpgradeableBeacon contract which defines the implementation for this proxy.
     * This is bytes32(uint256(keccak256('eip1967.proxy.beacon')) - 1)) and is validated in the constructor.
     */
    bytes32 internal constant _BEACON_SLOT = 0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50;

    /**
     * @dev Emitted when the beacon is upgraded.
     */
    event BeaconUpgraded(address indexed beacon);

    /**
     * @dev Returns the current beacon.
     */
    function _getBeacon() internal view returns (address) {
        return StorageSlotUpgradeable.getAddressSlot(_BEACON_SLOT).value;
    }

    /**
     * @dev Stores a new beacon in the EIP1967 beacon slot.
     */
    function _setBeacon(address newBeacon) private {
        require(AddressUpgradeable.isContract(newBeacon), "ERC1967: new beacon is not a contract");
        require(
            AddressUpgradeable.isContract(IBeaconUpgradeable(newBeacon).implementation()),
            "ERC1967: beacon implementation is not a contract"
        );
        StorageSlotUpgradeable.getAddressSlot(_BEACON_SLOT).value = newBeacon;
    }

    /**
     * @dev Perform beacon upgrade with additional setup call. Note: This upgrades the address of the beacon, it does
     * not upgrade the implementation contained in the beacon (see {UpgradeableBeacon-_setImplementation} for that).
     *
     * Emits a {BeaconUpgraded} event.
     */
    function _upgradeBeaconToAndCall(
        address newBeacon,
        bytes memory data,
        bool forceCall
    ) internal {
        _setBeacon(newBeacon);
        emit BeaconUpgraded(newBeacon);
        if (data.length > 0 || forceCall) {
            _functionDelegateCall(IBeaconUpgradeable(newBeacon).implementation(), data);
        }
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],
     * but performing a delegate call.
     *
     * _Available since v3.4._
     */
    function _functionDelegateCall(address target, bytes memory data) private returns (bytes memory) {
        require(AddressUpgradeable.isContract(target), "Address: delegate call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return AddressUpgradeable.verifyCallResult(success, returndata, "Address: low-level delegate call failed");
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (proxy/utils/UUPSUpgradeable.sol)

pragma solidity ^0.8.0;

////import "../../interfaces/draft-IERC1822Upgradeable.sol";
////import "../ERC1967/ERC1967UpgradeUpgradeable.sol";
////import "./Initializable.sol";

/**
 * @dev An upgradeability mechanism designed for UUPS proxies. The functions included here can perform an upgrade of an
 * {ERC1967Proxy}, when this contract is set as the implementation behind such a proxy.
 *
 * A security mechanism ensures that an upgrade does not turn off upgradeability accidentally, although this risk is
 * reinstated if the upgrade retains upgradeability but removes the security mechanism, e.g. by replacing
 * `UUPSUpgradeable` with a custom implementation of upgrades.
 *
 * The {_authorizeUpgrade} function must be overridden to include access restriction to the upgrade mechanism.
 *
 * _Available since v4.1._
 */
abstract contract UUPSUpgradeable is Initializable, IERC1822ProxiableUpgradeable, ERC1967UpgradeUpgradeable {
    function __UUPSUpgradeable_init() internal onlyInitializing {}

    function __UUPSUpgradeable_init_unchained() internal onlyInitializing {}

    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable state-variable-assignment
    address private immutable __self = address(this);

    /**
     * @dev Check that the execution is being performed through a delegatecall call and that the execution context is
     * a proxy contract with an implementation (as defined in ERC1967) pointing to self. This should only be the case
     * for UUPS and transparent proxies that are using the current contract as their implementation. Execution of a
     * function through ERC1167 minimal proxies (clones) would not normally pass this test, but is not guaranteed to
     * fail.
     */
    modifier onlyProxy() {
        require(address(this) != __self, "Function must be called through delegatecall");
        require(_getImplementation() == __self, "Function must be called through active proxy");
        _;
    }

    /**
     * @dev Check that the execution is not being performed through a delegate call. This allows a function to be
     * callable on the implementing contract but not through proxies.
     */
    modifier notDelegated() {
        require(address(this) == __self, "UUPSUpgradeable: must not be called through delegatecall");
        _;
    }

    /**
     * @dev Implementation of the ERC1822 {proxiableUUID} function. This returns the storage slot used by the
     * implementation. It is used to validate the implementation's compatibility when performing an upgrade.
     *
     * ////IMPORTANT: A proxy pointing at a proxiable contract should not be considered proxiable itself, because this risks
     * bricking a proxy that upgrades to it, by delegating to itself until out of gas. Thus it is critical that this
     * function revert if invoked through a proxy. This is guaranteed by the `notDelegated` modifier.
     */
    function proxiableUUID() external view virtual override notDelegated returns (bytes32) {
        return _IMPLEMENTATION_SLOT;
    }

    /**
     * @dev Upgrade the implementation of the proxy to `newImplementation`.
     *
     * Calls {_authorizeUpgrade}.
     *
     * Emits an {Upgraded} event.
     */
    function upgradeTo(address newImplementation) external virtual onlyProxy {
        _authorizeUpgrade(newImplementation);
        _upgradeToAndCallUUPS(newImplementation, new bytes(0), false);
    }

    /**
     * @dev Upgrade the implementation of the proxy to `newImplementation`, and subsequently execute the function call
     * encoded in `data`.
     *
     * Calls {_authorizeUpgrade}.
     *
     * Emits an {Upgraded} event.
     */
    function upgradeToAndCall(address newImplementation, bytes memory data) external payable virtual onlyProxy {
        _authorizeUpgrade(newImplementation);
        _upgradeToAndCallUUPS(newImplementation, data, true);
    }

    /**
     * @dev Function that should revert when `msg.sender` is not authorized to upgrade the contract. Called by
     * {upgradeTo} and {upgradeToAndCall}.
     *
     * Normally, this function will use an xref:access.adoc[access control] modifier such as {Ownable-onlyOwner}.
     *
     * ```solidity
     * function _authorizeUpgrade(address) internal override onlyOwner {}
     * ```
     */
    function _authorizeUpgrade(address newImplementation) internal virtual;

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
// OpenZeppelin Contracts v4.4.1 (token/ERC20/extensions/draft-IERC20Permit.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
 * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
 *
 * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
 * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
 * need to send a transaction, and thus is not required to hold Ether at all.
 */
interface IERC20PermitUpgradeable {
    /**
     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
     * given ``owner``'s signed approval.
     *
     * ////IMPORTANT: The same issues {IERC20-approve} has related to transaction
     * ordering also apply here.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `deadline` must be a timestamp in the future.
     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
     * over the EIP712-formatted function arguments.
     * - the signature must use ``owner``'s current nonce (see {nonces}).
     *
     * For more information on the signature format, see the
     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
     * section].
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    /**
     * @dev Returns the current nonce for `owner`. This value must be
     * included whenever a signature is generated for {permit}.
     *
     * Every successful call to {permit} increases ``owner``'s nonce by one. This
     * prevents a signature from being used multiple times.
     */
    function nonces(address owner) external view returns (uint256);

    /**
     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
     */
    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view returns (bytes32);
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
// OpenZeppelin Contracts (last updated v4.6.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20Upgradeable {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * ////IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

//SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

/**
 *  @title UToken Interface
 *  @dev Union members can borrow and repay thru this component.
 */
interface IUToken {
    function setAssetManager(address assetManager) external;

    function setUserManager(address userManager) external;

    function exchangeRateStored() external view returns (uint256);

    function exchangeRateCurrent() external returns (uint256);

    function overdueTime() external view returns (uint256);

    function getRemainingDebtCeiling() external view returns (uint256);

    function getBorrowed(address account) external view returns (uint256);

    function getLastRepay(address account) external view returns (uint256);

    function checkIsOverdue(address account) external view returns (bool);

    function borrowRatePerSecond() external view returns (uint256);

    function calculatingFee(uint256 amount) external view returns (uint256);

    function calculatingInterest(address account) external view returns (uint256);

    function borrowBalanceView(address account) external view returns (uint256);

    function setOriginationFee(uint256 originationFee_) external;

    function setDebtCeiling(uint256 debtCeiling_) external;

    function setMaxBorrow(uint256 maxBorrow_) external;

    function setMinBorrow(uint256 minBorrow_) external;

    function setOverdueTime(uint256 overdueBlocks_) external;

    function setInterestRateModel(address newInterestRateModel) external;

    function setReserveFactor(uint256 reserveFactorMantissa_) external;

    function supplyRatePerSecond() external returns (uint256);

    function accrueInterest() external returns (bool);

    function balanceOfUnderlying(address owner) external returns (uint256);

    function mint(uint256 mintAmount) external;

    function redeem(uint256 amountIn, uint256 amountOut) external;

    function addReserves(uint256 addAmount) external;

    function removeReserves(address receiver, uint256 reduceAmount) external;

    function borrow(address to, uint256 amount) external;

    function repayInterest(address borrower) external;

    function repayBorrow(address borrower, uint256 amount) external;

    function debtWriteOff(address borrower, uint256 amount) external;

    function setMintFeeRate(uint256 newRate) external;
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

pragma solidity 0.8.16;

////import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title UnionToken Interface
 * @dev Mint and distribute UnionTokens.
 */
interface IUnionToken is IERC20 {
    function owner() external view returns (address);

    function mint(address account, uint256 amount) external returns (bool);

    function getPriorVotes(address account, uint256 blockNumber) external view returns (uint256);

    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function burnFrom(address account, uint256 amount) external;

    function disableWhitelist() external;
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

pragma solidity 0.8.16;

/**
 * @title Comptroller Interface
 * @dev Work with UnionToken and UserManager to calculate the Union rewards based on the staking info from UserManager, and be ready to support multiple UserManagers for various tokens when we support multiple assets.
 */
interface IComptroller {
    function setHalfDecayPoint(uint256 point) external;

    function inflationPerSecond(uint256 effectiveTotalStake) external view returns (uint256);

    /**
     *  @dev Get the reward multiplier based on the account status
     *  @param account Account address
     *  @return Multiplier number (in wei)
     */
    function getRewardsMultiplier(address account, address token) external view returns (uint256);

    /**
     *  @dev Withdraw rewards
     *  @param account User address
     *  @param token address
     *  @return Amount of rewards
     */
    function withdrawRewards(address account, address token) external returns (uint256);

    function accrueRewards(address account, address token) external;

    function updateTotalStaked(address token, uint256 totalStaked) external returns (bool);

    /**
     *  @dev Calculate currently unclaimed rewards
     *  @param account Account address
     *  @param token address
     *  @return Unclaimed rewards
     */
    function calculateRewards(address account, address token) external view returns (uint256);
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

pragma solidity 0.8.16;

/**
 * @title UserManager Interface
 * @dev Manages the Union members credit lines, and their vouchees and borrowers info.
 */
interface IUserManager {
    function memberFrozen(address staker) external view returns (uint256);

    function stakers(address staker)
        external
        view
        returns (
            bool,
            uint96,
            uint96,
            uint64,
            uint256,
            uint256
        );

    function vouchers(address borrower, uint256 index)
        external
        view
        returns (
            address,
            uint96,
            uint96,
            uint64
        );

    function stakingToken() external view returns (address);

    function vouchees(address staker, uint256 index) external view returns (address, uint96);

    function voucherIndexes(address borrower, address staker) external view returns (bool, uint128);

    function voucheeIndexes(address borrower, address staker) external view returns (bool, uint128);

    function setMaxStakeAmount(uint96 maxStakeAmount) external;

    function setUToken(address uToken) external;

    function setNewMemberFee(uint256 amount) external;

    function setMaxOverdueTime(uint256 maxOverdueTime) external;

    function setEffectiveCount(uint256 effectiveCount) external;

    function getVoucherCount(address borrower) external view returns (uint256);

    function getVoucheeCount(address staker) external view returns (uint256);

    function getLockedStake(address staker, address borrower) external view returns (uint256);

    function getVouchingAmount(address staker, address borrower) external view returns (uint256);

    function registerMemberWithPermit(
        address newMember,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function withdrawRewards() external;

    function debtWriteOff(
        address staker,
        address borrower,
        uint256 amount
    ) external;

    /**
     *  @dev Check if the account is a valid member
     *  @param account Member address
     *  @return Address whether is member
     */
    function checkIsMember(address account) external view returns (bool);

    /**
     *  @dev Get the member's available credit line
     *  @param account Member address
     *  @return Limit
     */
    function getCreditLimit(address account) external view returns (uint256);

    function totalStaked() external view returns (uint256);

    function totalFrozen() external view returns (uint256);

    function globalTotalStaked() external view returns (uint256);

    /**
     *  @dev Add a new member
     *  Accept claims only from the admin
     *  @param account Member address
     */
    function addMember(address account) external;

    /**
     *  @dev Update the trust amount for existing members.
     *  @param borrower Borrower address
     *  @param trustAmount Trust amount
     */
    function updateTrust(address borrower, uint96 trustAmount) external;

    /**
     *  @dev Apply for membership, and burn UnionToken as application fees
     *  @param newMember New member address
     */
    function registerMember(address newMember) external;

    /**
     *  @dev Stop vouch for other member.
     *  @param staker Staker address
     *  @param account Account address
     */
    function cancelVouch(address staker, address account) external;

    /**
     *  @dev Get the user's locked stake from all his backed loans
     *  @param staker Staker address
     *  @return LockedStake
     */
    function getTotalLockedStake(address staker) external view returns (uint256);

    /**
     *  @dev Get the staker's effective staked and locked amount
     *  @param staker Staker address
     *  @return is member
     *          effective staked amount
     *          effective locked amount
     *          frozen amount
     */
    function getStakeInfo(address staker)
        external
        view
        returns (
            bool,
            uint256,
            uint256,
            uint256
        );

    /**
     * @dev Update the frozen info by the comptroller
     * @param staker Staker address
     * @return  effectStaked user's total stake - frozen
     *          effectLocked user's locked amount - frozen
     */
    function onWithdrawRewards(address staker)
        external
        returns (
            uint256,
            uint256,
            bool
        );

    /**
     * @dev Update the frozen info by the utoken repay
     * @param borrower Borrower address
     * @param pastBlocks blocks since last repay
     */
    function onRepayBorrow(address borrower, uint256 pastBlocks) external;

    /**
     *  @dev Update userManager locked info
     *  @param borrower Borrower address
     *  @param amount Borrow or repay amount(Including previously accrued interest)
     *  @param isBorrow True is borrow, false is repay
     */
    function updateLocked(
        address borrower,
        uint256 amount,
        bool isBorrow
    ) external;

    /**
     *  @dev Get the user's deposited stake amount
     *  @param account Member address
     *  @return Deposited stake amount
     */
    function getStakerBalance(address account) external view returns (uint256);

    /**
     *  @dev Stake
     *  @param amount Amount
     */
    function stake(uint96 amount) external;

    /**
     *  @dev Unstake
     *  @param amount Amount
     */
    function unstake(uint96 amount) external;
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

pragma solidity 0.8.16;

/**
 *  @title AssetManager Interface
 *  @dev Manage the token balances staked by the users and deposited by admins, and invest tokens to the integrated underlying lending protocols.
 */
interface IAssetManager {
    /**
     *  @dev Set market registry
     *  @param marketRegistry contract address
     */
    function setMarketRegistry(address marketRegistry) external;

    /**
     *  @dev Returns the balance of asset manager, plus the total amount of tokens deposited to all the underlying lending protocols.
     *  @param tokenAddress ERC20 token address
     *  @return Lending pool balance
     */
    function getPoolBalance(address tokenAddress) external view returns (uint256);

    /**
     *  @dev Returns the amount of the lending pool balance minus the amount of total staked.
     *  @param tokenAddress ERC20 token address
     *  @return Amount can be borrowed
     */
    function getLoanableAmount(address tokenAddress) external view returns (uint256);

    /**
     *  @dev Get the total amount of tokens deposited to all the integrated underlying protocols without side effects.
     *  @param tokenAddress ERC20 token address
     *  @return Total market balance
     */
    function totalSupply(address tokenAddress) external returns (uint256);

    /**
     *  @dev Get the total amount of tokens deposited to all the integrated underlying protocols, but without side effects. Safe to call anytime, but may not get the most updated number for the current block. Call totalSupply() for that purpose.
     *  @param tokenAddress ERC20 token address
     *  @return Total market balance
     */
    function totalSupplyView(address tokenAddress) external view returns (uint256);

    /**
     *  @dev Check if there is an underlying protocol available for the given ERC20 token.
     *  @param tokenAddress ERC20 token address
     *  @return Whether is supported
     */
    function isMarketSupported(address tokenAddress) external view returns (bool);

    /**
     *  @dev Deposit tokens to AssetManager, and those tokens will be passed along to adapters to deposit to integrated asset protocols if any is available.
     *  @param token ERC20 token address
     *  @param amount Deposit amount, in wei
     *  @return Deposited amount
     */
    function deposit(address token, uint256 amount) external returns (bool);

    /**
     *  @dev Withdraw from AssetManager
     *  @param token ERC20 token address
     *  @param account User address
     *  @param amount Withdraw amount, in wei
     *  @return Withdraw amount
     */
    function withdraw(
        address token,
        address account,
        uint256 amount
    ) external returns (uint256);

    /**
     *  @dev Add a new ERC20 token to support in AssetManager
     *  @param tokenAddress ERC20 token address
     */
    function addToken(address tokenAddress) external;

    /**
     *  @dev Remove a ERC20 token to support in AssetManager
     *  @param tokenAddress ERC20 token address
     */
    function removeToken(address tokenAddress) external;

    /**
     *  @dev Add a new adapter for the underlying lending protocol
     *  @param adapterAddress adapter address
     */
    function addAdapter(address adapterAddress) external;

    /**
     *  @dev Remove a adapter for the underlying lending protocol
     *  @param adapterAddress adapter address
     */
    function removeAdapter(address adapterAddress) external;

    /**
     *  @dev For a give token set allowance for all integrated money markets
     *  @param tokenAddress ERC20 token address
     */
    function approveAllMarketsMax(address tokenAddress) external;

    /**
     *  @dev For a give moeny market set allowance for all underlying tokens
     *  @param adapterAddress Address of adaptor for money market
     */
    function approveAllTokensMax(address adapterAddress) external;

    /**
     *  @dev Set withdraw sequence
     *  @param newSeq priority sequence of money market indices to be used while withdrawing
     */
    function setWithdrawSequence(address[] calldata newSeq) external;

    /**
     *  @dev Rebalance the tokens between integrated lending protocols
     *  @param tokenAddress ERC20 token address
     *  @param percentages Proportion
     */
    function rebalance(address tokenAddress, uint256[] calldata percentages) external;

    /**
     *  @dev Get the number of supported underlying protocols.
     *  @return MoneyMarkets length
     */
    function moneyMarketsCount() external view returns (uint256);

    /**
     *  @dev Get the count of supported tokens
     *  @return Number of supported tokens
     */
    function supportedTokensCount() external view returns (uint256);

    /**
     *  @dev Get the supported lending protocol
     *  @param tokenAddress ERC20 token address
     *  @param marketId MoneyMarkets array index
     *  @return tokenSupply
     */
    function getMoneyMarket(address tokenAddress, uint256 marketId) external view returns (uint256, uint256);

    /**
     *  @dev debt write off
     *  @param tokenAddress ERC20 token address
     *  @param amount WriteOff amount
     */
    function debtWriteOff(address tokenAddress, uint256 amount) external;
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

pragma solidity 0.8.16;

////import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
////import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title Controller component
 * @dev For easy access to any core components
 */
abstract contract Controller is Initializable, UUPSUpgradeable {
    /* -------------------------------------------------------------------
      Storage 
    ------------------------------------------------------------------- */

    /**
     * @dev The address of the admin
     */
    address public admin;

    /**
     * @dev The address of the pending admin
     */
    address public pendingAdmin;

    /**
     * @dev Is the contract paused
     */
    bool private _paused;

    /**
     * @dev The address of the pause guardian
     */
    address public pauseGuardian;

    /* -------------------------------------------------------------------
      Errors 
    ------------------------------------------------------------------- */

    error Paused();
    error NotPaused();
    error SenderNotAdmin();
    error SenderNotGuardian();
    error SenderNotPendingAdmin();

    /* -------------------------------------------------------------------
      Events 
    ------------------------------------------------------------------- */

    /**
     * @dev Emitted when the pause is triggered by a pauser (`account`).
     */
    event LogPaused(address account);

    /**
     * @dev Emitted when the pause is lifted by a pauser (`account`).
     */
    event LogUnpaused(address account);

    /* -------------------------------------------------------------------
      Modifiers 
    ------------------------------------------------------------------- */

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     */
    modifier whenNotPaused() {
        if (_paused) revert Paused();
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     */
    modifier whenPaused() {
        if (!_paused) revert NotPaused();
        _;
    }

    modifier onlyAdmin() {
        if (admin != msg.sender) revert SenderNotAdmin();
        _;
    }

    modifier onlyGuardian() {
        if (pauseGuardian != msg.sender) revert SenderNotGuardian();
        _;
    }

    /* -------------------------------------------------------------------
      Constructor/Initializer 
    ------------------------------------------------------------------- */

    //When using minimal deploy, do not call initialize directly during deploy, because msg.sender is the proxyFactory address, and you need to call it manually
    function __Controller_init(address admin_) internal onlyInitializing {
        _paused = false;
        admin = admin_;
        __UUPSUpgradeable_init();
        pauseGuardian = admin_;
    }

    /* -------------------------------------------------------------------
      Core Functions 
    ------------------------------------------------------------------- */

    function _authorizeUpgrade(address) internal view override onlyAdmin {}

    /**
     * @dev Check if the address provided is the admin
     * @param account Account address
     */
    function isAdmin(address account) public view returns (bool) {
        return account == admin;
    }

    /**
     * @dev set new admin account
     * @param account Account address
     */
    function setPendingAdmin(address account) public onlyAdmin {
        pendingAdmin = account;
    }

    function acceptAdmin() public {
        if (pendingAdmin != msg.sender) revert SenderNotPendingAdmin();
        admin = pendingAdmin;
    }

    /**
     * @dev Set pauseGuardian account
     * @param account Account address
     */
    function setGuardian(address account) external onlyAdmin {
        pauseGuardian = account;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view returns (bool) {
        return _paused;
    }

    /**
     * @dev Called by a pauser to pause, triggers stopped state.
     */
    function pause() external onlyGuardian whenNotPaused {
        _paused = true;
        emit LogPaused(msg.sender);
    }

    /**
     * @dev Called by a pauser to unpause, returns to normal state.
     */
    function unpause() external onlyGuardian whenPaused {
        _paused = false;
        emit LogUnpaused(msg.sender);
    }

    uint256[50] private ______gap;
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (utils/math/SafeCast.sol)
// This file was procedurally generated from scripts/generate/templates/SafeCast.js.

pragma solidity ^0.8.0;

/**
 * @dev Wrappers over Solidity's uintXX/intXX casting operators with added overflow
 * checks.
 *
 * Downcasting from uint256/int256 in Solidity does not revert on overflow. This can
 * easily result in undesired exploitation or bugs, since developers usually
 * assume that overflows raise errors. `SafeCast` restores this intuition by
 * reverting the transaction when such an operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 *
 * Can be combined with {SafeMath} and {SignedSafeMath} to extend it to smaller types, by performing
 * all math on `uint256` and `int256` and then downcasting.
 */
library SafeCastUpgradeable {
    /**
     * @dev Returns the downcasted uint248 from uint256, reverting on
     * overflow (when the input is greater than largest uint248).
     *
     * Counterpart to Solidity's `uint248` operator.
     *
     * Requirements:
     *
     * - input must fit into 248 bits
     *
     * _Available since v4.7._
     */
    function toUint248(uint256 value) internal pure returns (uint248) {
        require(value <= type(uint248).max, "SafeCast: value doesn't fit in 248 bits");
        return uint248(value);
    }

    /**
     * @dev Returns the downcasted uint240 from uint256, reverting on
     * overflow (when the input is greater than largest uint240).
     *
     * Counterpart to Solidity's `uint240` operator.
     *
     * Requirements:
     *
     * - input must fit into 240 bits
     *
     * _Available since v4.7._
     */
    function toUint240(uint256 value) internal pure returns (uint240) {
        require(value <= type(uint240).max, "SafeCast: value doesn't fit in 240 bits");
        return uint240(value);
    }

    /**
     * @dev Returns the downcasted uint232 from uint256, reverting on
     * overflow (when the input is greater than largest uint232).
     *
     * Counterpart to Solidity's `uint232` operator.
     *
     * Requirements:
     *
     * - input must fit into 232 bits
     *
     * _Available since v4.7._
     */
    function toUint232(uint256 value) internal pure returns (uint232) {
        require(value <= type(uint232).max, "SafeCast: value doesn't fit in 232 bits");
        return uint232(value);
    }

    /**
     * @dev Returns the downcasted uint224 from uint256, reverting on
     * overflow (when the input is greater than largest uint224).
     *
     * Counterpart to Solidity's `uint224` operator.
     *
     * Requirements:
     *
     * - input must fit into 224 bits
     *
     * _Available since v4.2._
     */
    function toUint224(uint256 value) internal pure returns (uint224) {
        require(value <= type(uint224).max, "SafeCast: value doesn't fit in 224 bits");
        return uint224(value);
    }

    /**
     * @dev Returns the downcasted uint216 from uint256, reverting on
     * overflow (when the input is greater than largest uint216).
     *
     * Counterpart to Solidity's `uint216` operator.
     *
     * Requirements:
     *
     * - input must fit into 216 bits
     *
     * _Available since v4.7._
     */
    function toUint216(uint256 value) internal pure returns (uint216) {
        require(value <= type(uint216).max, "SafeCast: value doesn't fit in 216 bits");
        return uint216(value);
    }

    /**
     * @dev Returns the downcasted uint208 from uint256, reverting on
     * overflow (when the input is greater than largest uint208).
     *
     * Counterpart to Solidity's `uint208` operator.
     *
     * Requirements:
     *
     * - input must fit into 208 bits
     *
     * _Available since v4.7._
     */
    function toUint208(uint256 value) internal pure returns (uint208) {
        require(value <= type(uint208).max, "SafeCast: value doesn't fit in 208 bits");
        return uint208(value);
    }

    /**
     * @dev Returns the downcasted uint200 from uint256, reverting on
     * overflow (when the input is greater than largest uint200).
     *
     * Counterpart to Solidity's `uint200` operator.
     *
     * Requirements:
     *
     * - input must fit into 200 bits
     *
     * _Available since v4.7._
     */
    function toUint200(uint256 value) internal pure returns (uint200) {
        require(value <= type(uint200).max, "SafeCast: value doesn't fit in 200 bits");
        return uint200(value);
    }

    /**
     * @dev Returns the downcasted uint192 from uint256, reverting on
     * overflow (when the input is greater than largest uint192).
     *
     * Counterpart to Solidity's `uint192` operator.
     *
     * Requirements:
     *
     * - input must fit into 192 bits
     *
     * _Available since v4.7._
     */
    function toUint192(uint256 value) internal pure returns (uint192) {
        require(value <= type(uint192).max, "SafeCast: value doesn't fit in 192 bits");
        return uint192(value);
    }

    /**
     * @dev Returns the downcasted uint184 from uint256, reverting on
     * overflow (when the input is greater than largest uint184).
     *
     * Counterpart to Solidity's `uint184` operator.
     *
     * Requirements:
     *
     * - input must fit into 184 bits
     *
     * _Available since v4.7._
     */
    function toUint184(uint256 value) internal pure returns (uint184) {
        require(value <= type(uint184).max, "SafeCast: value doesn't fit in 184 bits");
        return uint184(value);
    }

    /**
     * @dev Returns the downcasted uint176 from uint256, reverting on
     * overflow (when the input is greater than largest uint176).
     *
     * Counterpart to Solidity's `uint176` operator.
     *
     * Requirements:
     *
     * - input must fit into 176 bits
     *
     * _Available since v4.7._
     */
    function toUint176(uint256 value) internal pure returns (uint176) {
        require(value <= type(uint176).max, "SafeCast: value doesn't fit in 176 bits");
        return uint176(value);
    }

    /**
     * @dev Returns the downcasted uint168 from uint256, reverting on
     * overflow (when the input is greater than largest uint168).
     *
     * Counterpart to Solidity's `uint168` operator.
     *
     * Requirements:
     *
     * - input must fit into 168 bits
     *
     * _Available since v4.7._
     */
    function toUint168(uint256 value) internal pure returns (uint168) {
        require(value <= type(uint168).max, "SafeCast: value doesn't fit in 168 bits");
        return uint168(value);
    }

    /**
     * @dev Returns the downcasted uint160 from uint256, reverting on
     * overflow (when the input is greater than largest uint160).
     *
     * Counterpart to Solidity's `uint160` operator.
     *
     * Requirements:
     *
     * - input must fit into 160 bits
     *
     * _Available since v4.7._
     */
    function toUint160(uint256 value) internal pure returns (uint160) {
        require(value <= type(uint160).max, "SafeCast: value doesn't fit in 160 bits");
        return uint160(value);
    }

    /**
     * @dev Returns the downcasted uint152 from uint256, reverting on
     * overflow (when the input is greater than largest uint152).
     *
     * Counterpart to Solidity's `uint152` operator.
     *
     * Requirements:
     *
     * - input must fit into 152 bits
     *
     * _Available since v4.7._
     */
    function toUint152(uint256 value) internal pure returns (uint152) {
        require(value <= type(uint152).max, "SafeCast: value doesn't fit in 152 bits");
        return uint152(value);
    }

    /**
     * @dev Returns the downcasted uint144 from uint256, reverting on
     * overflow (when the input is greater than largest uint144).
     *
     * Counterpart to Solidity's `uint144` operator.
     *
     * Requirements:
     *
     * - input must fit into 144 bits
     *
     * _Available since v4.7._
     */
    function toUint144(uint256 value) internal pure returns (uint144) {
        require(value <= type(uint144).max, "SafeCast: value doesn't fit in 144 bits");
        return uint144(value);
    }

    /**
     * @dev Returns the downcasted uint136 from uint256, reverting on
     * overflow (when the input is greater than largest uint136).
     *
     * Counterpart to Solidity's `uint136` operator.
     *
     * Requirements:
     *
     * - input must fit into 136 bits
     *
     * _Available since v4.7._
     */
    function toUint136(uint256 value) internal pure returns (uint136) {
        require(value <= type(uint136).max, "SafeCast: value doesn't fit in 136 bits");
        return uint136(value);
    }

    /**
     * @dev Returns the downcasted uint128 from uint256, reverting on
     * overflow (when the input is greater than largest uint128).
     *
     * Counterpart to Solidity's `uint128` operator.
     *
     * Requirements:
     *
     * - input must fit into 128 bits
     *
     * _Available since v2.5._
     */
    function toUint128(uint256 value) internal pure returns (uint128) {
        require(value <= type(uint128).max, "SafeCast: value doesn't fit in 128 bits");
        return uint128(value);
    }

    /**
     * @dev Returns the downcasted uint120 from uint256, reverting on
     * overflow (when the input is greater than largest uint120).
     *
     * Counterpart to Solidity's `uint120` operator.
     *
     * Requirements:
     *
     * - input must fit into 120 bits
     *
     * _Available since v4.7._
     */
    function toUint120(uint256 value) internal pure returns (uint120) {
        require(value <= type(uint120).max, "SafeCast: value doesn't fit in 120 bits");
        return uint120(value);
    }

    /**
     * @dev Returns the downcasted uint112 from uint256, reverting on
     * overflow (when the input is greater than largest uint112).
     *
     * Counterpart to Solidity's `uint112` operator.
     *
     * Requirements:
     *
     * - input must fit into 112 bits
     *
     * _Available since v4.7._
     */
    function toUint112(uint256 value) internal pure returns (uint112) {
        require(value <= type(uint112).max, "SafeCast: value doesn't fit in 112 bits");
        return uint112(value);
    }

    /**
     * @dev Returns the downcasted uint104 from uint256, reverting on
     * overflow (when the input is greater than largest uint104).
     *
     * Counterpart to Solidity's `uint104` operator.
     *
     * Requirements:
     *
     * - input must fit into 104 bits
     *
     * _Available since v4.7._
     */
    function toUint104(uint256 value) internal pure returns (uint104) {
        require(value <= type(uint104).max, "SafeCast: value doesn't fit in 104 bits");
        return uint104(value);
    }

    /**
     * @dev Returns the downcasted uint96 from uint256, reverting on
     * overflow (when the input is greater than largest uint96).
     *
     * Counterpart to Solidity's `uint96` operator.
     *
     * Requirements:
     *
     * - input must fit into 96 bits
     *
     * _Available since v4.2._
     */
    function toUint96(uint256 value) internal pure returns (uint96) {
        require(value <= type(uint96).max, "SafeCast: value doesn't fit in 96 bits");
        return uint96(value);
    }

    /**
     * @dev Returns the downcasted uint88 from uint256, reverting on
     * overflow (when the input is greater than largest uint88).
     *
     * Counterpart to Solidity's `uint88` operator.
     *
     * Requirements:
     *
     * - input must fit into 88 bits
     *
     * _Available since v4.7._
     */
    function toUint88(uint256 value) internal pure returns (uint88) {
        require(value <= type(uint88).max, "SafeCast: value doesn't fit in 88 bits");
        return uint88(value);
    }

    /**
     * @dev Returns the downcasted uint80 from uint256, reverting on
     * overflow (when the input is greater than largest uint80).
     *
     * Counterpart to Solidity's `uint80` operator.
     *
     * Requirements:
     *
     * - input must fit into 80 bits
     *
     * _Available since v4.7._
     */
    function toUint80(uint256 value) internal pure returns (uint80) {
        require(value <= type(uint80).max, "SafeCast: value doesn't fit in 80 bits");
        return uint80(value);
    }

    /**
     * @dev Returns the downcasted uint72 from uint256, reverting on
     * overflow (when the input is greater than largest uint72).
     *
     * Counterpart to Solidity's `uint72` operator.
     *
     * Requirements:
     *
     * - input must fit into 72 bits
     *
     * _Available since v4.7._
     */
    function toUint72(uint256 value) internal pure returns (uint72) {
        require(value <= type(uint72).max, "SafeCast: value doesn't fit in 72 bits");
        return uint72(value);
    }

    /**
     * @dev Returns the downcasted uint64 from uint256, reverting on
     * overflow (when the input is greater than largest uint64).
     *
     * Counterpart to Solidity's `uint64` operator.
     *
     * Requirements:
     *
     * - input must fit into 64 bits
     *
     * _Available since v2.5._
     */
    function toUint64(uint256 value) internal pure returns (uint64) {
        require(value <= type(uint64).max, "SafeCast: value doesn't fit in 64 bits");
        return uint64(value);
    }

    /**
     * @dev Returns the downcasted uint56 from uint256, reverting on
     * overflow (when the input is greater than largest uint56).
     *
     * Counterpart to Solidity's `uint56` operator.
     *
     * Requirements:
     *
     * - input must fit into 56 bits
     *
     * _Available since v4.7._
     */
    function toUint56(uint256 value) internal pure returns (uint56) {
        require(value <= type(uint56).max, "SafeCast: value doesn't fit in 56 bits");
        return uint56(value);
    }

    /**
     * @dev Returns the downcasted uint48 from uint256, reverting on
     * overflow (when the input is greater than largest uint48).
     *
     * Counterpart to Solidity's `uint48` operator.
     *
     * Requirements:
     *
     * - input must fit into 48 bits
     *
     * _Available since v4.7._
     */
    function toUint48(uint256 value) internal pure returns (uint48) {
        require(value <= type(uint48).max, "SafeCast: value doesn't fit in 48 bits");
        return uint48(value);
    }

    /**
     * @dev Returns the downcasted uint40 from uint256, reverting on
     * overflow (when the input is greater than largest uint40).
     *
     * Counterpart to Solidity's `uint40` operator.
     *
     * Requirements:
     *
     * - input must fit into 40 bits
     *
     * _Available since v4.7._
     */
    function toUint40(uint256 value) internal pure returns (uint40) {
        require(value <= type(uint40).max, "SafeCast: value doesn't fit in 40 bits");
        return uint40(value);
    }

    /**
     * @dev Returns the downcasted uint32 from uint256, reverting on
     * overflow (when the input is greater than largest uint32).
     *
     * Counterpart to Solidity's `uint32` operator.
     *
     * Requirements:
     *
     * - input must fit into 32 bits
     *
     * _Available since v2.5._
     */
    function toUint32(uint256 value) internal pure returns (uint32) {
        require(value <= type(uint32).max, "SafeCast: value doesn't fit in 32 bits");
        return uint32(value);
    }

    /**
     * @dev Returns the downcasted uint24 from uint256, reverting on
     * overflow (when the input is greater than largest uint24).
     *
     * Counterpart to Solidity's `uint24` operator.
     *
     * Requirements:
     *
     * - input must fit into 24 bits
     *
     * _Available since v4.7._
     */
    function toUint24(uint256 value) internal pure returns (uint24) {
        require(value <= type(uint24).max, "SafeCast: value doesn't fit in 24 bits");
        return uint24(value);
    }

    /**
     * @dev Returns the downcasted uint16 from uint256, reverting on
     * overflow (when the input is greater than largest uint16).
     *
     * Counterpart to Solidity's `uint16` operator.
     *
     * Requirements:
     *
     * - input must fit into 16 bits
     *
     * _Available since v2.5._
     */
    function toUint16(uint256 value) internal pure returns (uint16) {
        require(value <= type(uint16).max, "SafeCast: value doesn't fit in 16 bits");
        return uint16(value);
    }

    /**
     * @dev Returns the downcasted uint8 from uint256, reverting on
     * overflow (when the input is greater than largest uint8).
     *
     * Counterpart to Solidity's `uint8` operator.
     *
     * Requirements:
     *
     * - input must fit into 8 bits
     *
     * _Available since v2.5._
     */
    function toUint8(uint256 value) internal pure returns (uint8) {
        require(value <= type(uint8).max, "SafeCast: value doesn't fit in 8 bits");
        return uint8(value);
    }

    /**
     * @dev Converts a signed int256 into an unsigned uint256.
     *
     * Requirements:
     *
     * - input must be greater than or equal to 0.
     *
     * _Available since v3.0._
     */
    function toUint256(int256 value) internal pure returns (uint256) {
        require(value >= 0, "SafeCast: value must be positive");
        return uint256(value);
    }

    /**
     * @dev Returns the downcasted int248 from int256, reverting on
     * overflow (when the input is less than smallest int248 or
     * greater than largest int248).
     *
     * Counterpart to Solidity's `int248` operator.
     *
     * Requirements:
     *
     * - input must fit into 248 bits
     *
     * _Available since v4.7._
     */
    function toInt248(int256 value) internal pure returns (int248 downcasted) {
        downcasted = int248(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 248 bits");
    }

    /**
     * @dev Returns the downcasted int240 from int256, reverting on
     * overflow (when the input is less than smallest int240 or
     * greater than largest int240).
     *
     * Counterpart to Solidity's `int240` operator.
     *
     * Requirements:
     *
     * - input must fit into 240 bits
     *
     * _Available since v4.7._
     */
    function toInt240(int256 value) internal pure returns (int240 downcasted) {
        downcasted = int240(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 240 bits");
    }

    /**
     * @dev Returns the downcasted int232 from int256, reverting on
     * overflow (when the input is less than smallest int232 or
     * greater than largest int232).
     *
     * Counterpart to Solidity's `int232` operator.
     *
     * Requirements:
     *
     * - input must fit into 232 bits
     *
     * _Available since v4.7._
     */
    function toInt232(int256 value) internal pure returns (int232 downcasted) {
        downcasted = int232(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 232 bits");
    }

    /**
     * @dev Returns the downcasted int224 from int256, reverting on
     * overflow (when the input is less than smallest int224 or
     * greater than largest int224).
     *
     * Counterpart to Solidity's `int224` operator.
     *
     * Requirements:
     *
     * - input must fit into 224 bits
     *
     * _Available since v4.7._
     */
    function toInt224(int256 value) internal pure returns (int224 downcasted) {
        downcasted = int224(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 224 bits");
    }

    /**
     * @dev Returns the downcasted int216 from int256, reverting on
     * overflow (when the input is less than smallest int216 or
     * greater than largest int216).
     *
     * Counterpart to Solidity's `int216` operator.
     *
     * Requirements:
     *
     * - input must fit into 216 bits
     *
     * _Available since v4.7._
     */
    function toInt216(int256 value) internal pure returns (int216 downcasted) {
        downcasted = int216(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 216 bits");
    }

    /**
     * @dev Returns the downcasted int208 from int256, reverting on
     * overflow (when the input is less than smallest int208 or
     * greater than largest int208).
     *
     * Counterpart to Solidity's `int208` operator.
     *
     * Requirements:
     *
     * - input must fit into 208 bits
     *
     * _Available since v4.7._
     */
    function toInt208(int256 value) internal pure returns (int208 downcasted) {
        downcasted = int208(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 208 bits");
    }

    /**
     * @dev Returns the downcasted int200 from int256, reverting on
     * overflow (when the input is less than smallest int200 or
     * greater than largest int200).
     *
     * Counterpart to Solidity's `int200` operator.
     *
     * Requirements:
     *
     * - input must fit into 200 bits
     *
     * _Available since v4.7._
     */
    function toInt200(int256 value) internal pure returns (int200 downcasted) {
        downcasted = int200(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 200 bits");
    }

    /**
     * @dev Returns the downcasted int192 from int256, reverting on
     * overflow (when the input is less than smallest int192 or
     * greater than largest int192).
     *
     * Counterpart to Solidity's `int192` operator.
     *
     * Requirements:
     *
     * - input must fit into 192 bits
     *
     * _Available since v4.7._
     */
    function toInt192(int256 value) internal pure returns (int192 downcasted) {
        downcasted = int192(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 192 bits");
    }

    /**
     * @dev Returns the downcasted int184 from int256, reverting on
     * overflow (when the input is less than smallest int184 or
     * greater than largest int184).
     *
     * Counterpart to Solidity's `int184` operator.
     *
     * Requirements:
     *
     * - input must fit into 184 bits
     *
     * _Available since v4.7._
     */
    function toInt184(int256 value) internal pure returns (int184 downcasted) {
        downcasted = int184(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 184 bits");
    }

    /**
     * @dev Returns the downcasted int176 from int256, reverting on
     * overflow (when the input is less than smallest int176 or
     * greater than largest int176).
     *
     * Counterpart to Solidity's `int176` operator.
     *
     * Requirements:
     *
     * - input must fit into 176 bits
     *
     * _Available since v4.7._
     */
    function toInt176(int256 value) internal pure returns (int176 downcasted) {
        downcasted = int176(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 176 bits");
    }

    /**
     * @dev Returns the downcasted int168 from int256, reverting on
     * overflow (when the input is less than smallest int168 or
     * greater than largest int168).
     *
     * Counterpart to Solidity's `int168` operator.
     *
     * Requirements:
     *
     * - input must fit into 168 bits
     *
     * _Available since v4.7._
     */
    function toInt168(int256 value) internal pure returns (int168 downcasted) {
        downcasted = int168(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 168 bits");
    }

    /**
     * @dev Returns the downcasted int160 from int256, reverting on
     * overflow (when the input is less than smallest int160 or
     * greater than largest int160).
     *
     * Counterpart to Solidity's `int160` operator.
     *
     * Requirements:
     *
     * - input must fit into 160 bits
     *
     * _Available since v4.7._
     */
    function toInt160(int256 value) internal pure returns (int160 downcasted) {
        downcasted = int160(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 160 bits");
    }

    /**
     * @dev Returns the downcasted int152 from int256, reverting on
     * overflow (when the input is less than smallest int152 or
     * greater than largest int152).
     *
     * Counterpart to Solidity's `int152` operator.
     *
     * Requirements:
     *
     * - input must fit into 152 bits
     *
     * _Available since v4.7._
     */
    function toInt152(int256 value) internal pure returns (int152 downcasted) {
        downcasted = int152(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 152 bits");
    }

    /**
     * @dev Returns the downcasted int144 from int256, reverting on
     * overflow (when the input is less than smallest int144 or
     * greater than largest int144).
     *
     * Counterpart to Solidity's `int144` operator.
     *
     * Requirements:
     *
     * - input must fit into 144 bits
     *
     * _Available since v4.7._
     */
    function toInt144(int256 value) internal pure returns (int144 downcasted) {
        downcasted = int144(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 144 bits");
    }

    /**
     * @dev Returns the downcasted int136 from int256, reverting on
     * overflow (when the input is less than smallest int136 or
     * greater than largest int136).
     *
     * Counterpart to Solidity's `int136` operator.
     *
     * Requirements:
     *
     * - input must fit into 136 bits
     *
     * _Available since v4.7._
     */
    function toInt136(int256 value) internal pure returns (int136 downcasted) {
        downcasted = int136(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 136 bits");
    }

    /**
     * @dev Returns the downcasted int128 from int256, reverting on
     * overflow (when the input is less than smallest int128 or
     * greater than largest int128).
     *
     * Counterpart to Solidity's `int128` operator.
     *
     * Requirements:
     *
     * - input must fit into 128 bits
     *
     * _Available since v3.1._
     */
    function toInt128(int256 value) internal pure returns (int128 downcasted) {
        downcasted = int128(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 128 bits");
    }

    /**
     * @dev Returns the downcasted int120 from int256, reverting on
     * overflow (when the input is less than smallest int120 or
     * greater than largest int120).
     *
     * Counterpart to Solidity's `int120` operator.
     *
     * Requirements:
     *
     * - input must fit into 120 bits
     *
     * _Available since v4.7._
     */
    function toInt120(int256 value) internal pure returns (int120 downcasted) {
        downcasted = int120(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 120 bits");
    }

    /**
     * @dev Returns the downcasted int112 from int256, reverting on
     * overflow (when the input is less than smallest int112 or
     * greater than largest int112).
     *
     * Counterpart to Solidity's `int112` operator.
     *
     * Requirements:
     *
     * - input must fit into 112 bits
     *
     * _Available since v4.7._
     */
    function toInt112(int256 value) internal pure returns (int112 downcasted) {
        downcasted = int112(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 112 bits");
    }

    /**
     * @dev Returns the downcasted int104 from int256, reverting on
     * overflow (when the input is less than smallest int104 or
     * greater than largest int104).
     *
     * Counterpart to Solidity's `int104` operator.
     *
     * Requirements:
     *
     * - input must fit into 104 bits
     *
     * _Available since v4.7._
     */
    function toInt104(int256 value) internal pure returns (int104 downcasted) {
        downcasted = int104(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 104 bits");
    }

    /**
     * @dev Returns the downcasted int96 from int256, reverting on
     * overflow (when the input is less than smallest int96 or
     * greater than largest int96).
     *
     * Counterpart to Solidity's `int96` operator.
     *
     * Requirements:
     *
     * - input must fit into 96 bits
     *
     * _Available since v4.7._
     */
    function toInt96(int256 value) internal pure returns (int96 downcasted) {
        downcasted = int96(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 96 bits");
    }

    /**
     * @dev Returns the downcasted int88 from int256, reverting on
     * overflow (when the input is less than smallest int88 or
     * greater than largest int88).
     *
     * Counterpart to Solidity's `int88` operator.
     *
     * Requirements:
     *
     * - input must fit into 88 bits
     *
     * _Available since v4.7._
     */
    function toInt88(int256 value) internal pure returns (int88 downcasted) {
        downcasted = int88(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 88 bits");
    }

    /**
     * @dev Returns the downcasted int80 from int256, reverting on
     * overflow (when the input is less than smallest int80 or
     * greater than largest int80).
     *
     * Counterpart to Solidity's `int80` operator.
     *
     * Requirements:
     *
     * - input must fit into 80 bits
     *
     * _Available since v4.7._
     */
    function toInt80(int256 value) internal pure returns (int80 downcasted) {
        downcasted = int80(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 80 bits");
    }

    /**
     * @dev Returns the downcasted int72 from int256, reverting on
     * overflow (when the input is less than smallest int72 or
     * greater than largest int72).
     *
     * Counterpart to Solidity's `int72` operator.
     *
     * Requirements:
     *
     * - input must fit into 72 bits
     *
     * _Available since v4.7._
     */
    function toInt72(int256 value) internal pure returns (int72 downcasted) {
        downcasted = int72(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 72 bits");
    }

    /**
     * @dev Returns the downcasted int64 from int256, reverting on
     * overflow (when the input is less than smallest int64 or
     * greater than largest int64).
     *
     * Counterpart to Solidity's `int64` operator.
     *
     * Requirements:
     *
     * - input must fit into 64 bits
     *
     * _Available since v3.1._
     */
    function toInt64(int256 value) internal pure returns (int64 downcasted) {
        downcasted = int64(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 64 bits");
    }

    /**
     * @dev Returns the downcasted int56 from int256, reverting on
     * overflow (when the input is less than smallest int56 or
     * greater than largest int56).
     *
     * Counterpart to Solidity's `int56` operator.
     *
     * Requirements:
     *
     * - input must fit into 56 bits
     *
     * _Available since v4.7._
     */
    function toInt56(int256 value) internal pure returns (int56 downcasted) {
        downcasted = int56(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 56 bits");
    }

    /**
     * @dev Returns the downcasted int48 from int256, reverting on
     * overflow (when the input is less than smallest int48 or
     * greater than largest int48).
     *
     * Counterpart to Solidity's `int48` operator.
     *
     * Requirements:
     *
     * - input must fit into 48 bits
     *
     * _Available since v4.7._
     */
    function toInt48(int256 value) internal pure returns (int48 downcasted) {
        downcasted = int48(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 48 bits");
    }

    /**
     * @dev Returns the downcasted int40 from int256, reverting on
     * overflow (when the input is less than smallest int40 or
     * greater than largest int40).
     *
     * Counterpart to Solidity's `int40` operator.
     *
     * Requirements:
     *
     * - input must fit into 40 bits
     *
     * _Available since v4.7._
     */
    function toInt40(int256 value) internal pure returns (int40 downcasted) {
        downcasted = int40(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 40 bits");
    }

    /**
     * @dev Returns the downcasted int32 from int256, reverting on
     * overflow (when the input is less than smallest int32 or
     * greater than largest int32).
     *
     * Counterpart to Solidity's `int32` operator.
     *
     * Requirements:
     *
     * - input must fit into 32 bits
     *
     * _Available since v3.1._
     */
    function toInt32(int256 value) internal pure returns (int32 downcasted) {
        downcasted = int32(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 32 bits");
    }

    /**
     * @dev Returns the downcasted int24 from int256, reverting on
     * overflow (when the input is less than smallest int24 or
     * greater than largest int24).
     *
     * Counterpart to Solidity's `int24` operator.
     *
     * Requirements:
     *
     * - input must fit into 24 bits
     *
     * _Available since v4.7._
     */
    function toInt24(int256 value) internal pure returns (int24 downcasted) {
        downcasted = int24(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 24 bits");
    }

    /**
     * @dev Returns the downcasted int16 from int256, reverting on
     * overflow (when the input is less than smallest int16 or
     * greater than largest int16).
     *
     * Counterpart to Solidity's `int16` operator.
     *
     * Requirements:
     *
     * - input must fit into 16 bits
     *
     * _Available since v3.1._
     */
    function toInt16(int256 value) internal pure returns (int16 downcasted) {
        downcasted = int16(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 16 bits");
    }

    /**
     * @dev Returns the downcasted int8 from int256, reverting on
     * overflow (when the input is less than smallest int8 or
     * greater than largest int8).
     *
     * Counterpart to Solidity's `int8` operator.
     *
     * Requirements:
     *
     * - input must fit into 8 bits
     *
     * _Available since v3.1._
     */
    function toInt8(int256 value) internal pure returns (int8 downcasted) {
        downcasted = int8(value);
        require(downcasted == value, "SafeCast: value doesn't fit in 8 bits");
    }

    /**
     * @dev Converts an unsigned uint256 into a signed int256.
     *
     * Requirements:
     *
     * - input must be less than or equal to maxInt256.
     *
     * _Available since v3.0._
     */
    function toInt256(uint256 value) internal pure returns (int256) {
        // Note: Unsafe cast below is okay because `type(int256).max` is guaranteed to be positive
        require(value <= uint256(type(int256).max), "SafeCast: value doesn't fit in an int256");
        return int256(value);
    }
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (security/ReentrancyGuard.sol)

pragma solidity ^0.8.0;

////import "../proxy/utils/Initializable.sol";

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuardUpgradeable is Initializable {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    function __ReentrancyGuard_init() internal onlyInitializing {
        __ReentrancyGuard_init_unchained();
    }

    function __ReentrancyGuard_init_unchained() internal onlyInitializing {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be _NOT_ENTERED
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT
// OpenZeppelin Contracts (last updated v4.8.0) (token/ERC20/utils/SafeERC20.sol)

pragma solidity ^0.8.0;

////import "../IERC20Upgradeable.sol";
////import "../extensions/draft-IERC20PermitUpgradeable.sol";
////import "../../../utils/AddressUpgradeable.sol";

/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20Upgradeable {
    using AddressUpgradeable for address;

    function safeTransfer(
        IERC20Upgradeable token,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(
        IERC20Upgradeable token,
        address from,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    /**
     * @dev Deprecated. This function has issues similar to the ones found in
     * {IERC20-approve}, and its usage is discouraged.
     *
     * Whenever possible, use {safeIncreaseAllowance} and
     * {safeDecreaseAllowance} instead.
     */
    function safeApprove(
        IERC20Upgradeable token,
        address spender,
        uint256 value
    ) internal {
        // safeApprove should only be called when setting an initial allowance,
        // or when resetting it to zero. To increase and decrease it, use
        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'
        require(
            (value == 0) || (token.allowance(address(this), spender) == 0),
            "SafeERC20: approve from non-zero to non-zero allowance"
        );
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));
    }

    function safeIncreaseAllowance(
        IERC20Upgradeable token,
        address spender,
        uint256 value
    ) internal {
        uint256 newAllowance = token.allowance(address(this), spender) + value;
        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
    }

    function safeDecreaseAllowance(
        IERC20Upgradeable token,
        address spender,
        uint256 value
    ) internal {
        unchecked {
            uint256 oldAllowance = token.allowance(address(this), spender);
            require(oldAllowance >= value, "SafeERC20: decreased allowance below zero");
            uint256 newAllowance = oldAllowance - value;
            _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));
        }
    }

    function safePermit(
        IERC20PermitUpgradeable token,
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        uint256 nonceBefore = token.nonces(owner);
        token.permit(owner, spender, value, deadline, v, r, s);
        uint256 nonceAfter = token.nonces(owner);
        require(nonceAfter == nonceBefore + 1, "SafeERC20: permit did not succeed");
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20Upgradeable token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data, "SafeERC20: low-level call failed");
        if (returndata.length > 0) {
            // Return data is optional
            require(abi.decode(returndata, (bool)), "SafeERC20: ERC20 operation did not succeed");
        }
    }
}

/**
 *  SourceUnit: /Users/twy/Projects/union-v2-contracts/contracts/user/UserManager.sol
 */

pragma solidity 0.8.16;

////import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
////import {SafeERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
////import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
////import {SafeCastUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/math/SafeCastUpgradeable.sol";

////import {Controller} from "../Controller.sol";
////import {IAssetManager} from "../interfaces/IAssetManager.sol";
////import {IUserManager} from "../interfaces/IUserManager.sol";
////import {IComptroller} from "../interfaces/IComptroller.sol";
////import {IUnionToken} from "../interfaces/IUnionToken.sol";
////import {IUToken} from "../interfaces/IUToken.sol";

/**
 * @title UserManager Contract
 * @dev Manages the Union members stake and vouches.
 */
contract UserManager is Controller, IUserManager, ReentrancyGuardUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using SafeCastUpgradeable for uint256;
    using SafeCastUpgradeable for uint128;

    /* -------------------------------------------------------------------
      Storage Types 
    ------------------------------------------------------------------- */

    struct Vouch {
        // staker receiving the vouch
        address staker;
        // trust amount
        uint96 trust;
        // amount of stake locked by this vouch
        uint96 locked;
        // only update when lockedCoinAge is updated
        uint64 lastUpdated;
    }

    struct Staker {
        bool isMember;
        uint96 stakedAmount;
        uint96 locked;
        uint64 lastUpdated; // only update when stakedCoinAge is updated
        uint256 stakedCoinAge;
        uint256 lockedCoinAge;
    }

    struct Index {
        bool isSet;
        uint128 idx;
    }

    struct Vouchee {
        address borrower;
        uint96 voucherIndex;
    }

    /* -------------------------------------------------------------------
      Memory Types 
    ------------------------------------------------------------------- */

    struct CoinAge {
        uint256 stakedCoinAge;
        uint256 lockedCoinAge;
        uint256 frozenCoinAge;
        uint256 sinceLastWithdrawRewards;
    }

    /* -------------------------------------------------------------------
      Storage 
    ------------------------------------------------------------------- */

    /**
     *  @dev Max amount that can be staked of the staking token
     */
    uint96 public maxStakeAmount;

    /**
     *  @dev The staking token that is staked in the comptroller
     */
    address public stakingToken;

    /**
     *  @dev Address of the UNION token contract
     */
    address public unionToken;

    /**
     *  @dev Address of the asset manager contract
     */
    address public assetManager;

    /**
     *  @dev uToken contract
     */
    IUToken public uToken;

    /**
     *  @dev Comptroller contract
     */
    IComptroller public comptroller;

    /**
     * @dev Number of vouches needed to become a member
     */
    uint256 public effectiveCount;

    /**
     *  @dev New member fee
     */
    uint256 public newMemberFee;

    /**
     *  @dev Total amount of staked staked token
     */
    uint256 public totalStaked;

    /**
     *  @dev Total amount of stake frozen
     */
    uint256 public totalFrozen;

    /**
     *  @dev Max duration (in seconds) can be overdue for
     */
    uint256 public maxOverdueTime;

    /**
     * @dev Max voucher limit
     */
    uint256 public maxVouchers;

    /**
     * @dev Max vouchees limit
     */
    uint256 public maxVouchees;

    /**
     *  @dev Union Stakers
     */
    mapping(address => Staker) public stakers;

    /**
     *  @dev Borrower (borrower) mapped to received vouches (staker)
     */
    mapping(address => Vouch[]) public vouchers;

    /**
     * @dev Borrower mapped to Staker mapped to index in vouchers array
     */
    mapping(address => mapping(address => Index)) public voucherIndexes;

    /**
     *  @dev Staker (staker) mapped to vouches given (borrower)
     */
    mapping(address => Vouchee[]) public vouchees;

    /**
     * @dev Borrower mapped to Staker mapped to index in vochee array
     */
    mapping(address => mapping(address => Index)) public voucheeIndexes;

    /**
     * @dev Stakers frozen amounts
     */
    mapping(address => uint256) public memberFrozen;

    /**
     * @dev Stakers mapped to frozen coin age
     */
    mapping(address => uint256) public frozenCoinAge;

    /**
     * @dev Stakers mapped the block timestamp of latest rewards withdrawal
     */
    mapping(address => uint256) public gLastWithdrawRewards;

    /* -------------------------------------------------------------------
      Errors 
    ------------------------------------------------------------------- */

    error AuthFailed();
    error ErrorSelfVouching();
    error TrustAmountLtLocked();
    error NoExistingMember();
    error NotEnoughStakers();
    error StakeLimitReached();
    error AssetManagerDepositFailed();
    error AssetManagerWithdrawFailed();
    error InsufficientBalance();
    error LockedStakeNonZero();
    error NotOverdue();
    error ExceedsLocked();
    error AmountZero();
    error LockedRemaining();
    error VoucherNotFound();
    error VouchWhenOverdue();
    error MaxVouchers();
    error MaxVouchees();
    error InvalidParams();

    /* -------------------------------------------------------------------
      Events 
    ------------------------------------------------------------------- */

    /**
     *  @dev Add new member event
     *  @param member New member address
     */
    event LogAddMember(address member);

    /**
     *  @dev Update vouch for existing member event
     *  @param staker Trustee address
     *  @param borrower The address gets vouched for
     *  @param trustAmount Vouch amount
     */
    event LogUpdateTrust(address indexed staker, address indexed borrower, uint256 trustAmount);

    /**
     *  @dev New member application event
     *  @param account New member's voucher address
     *  @param borrower New member address
     */
    event LogRegisterMember(address indexed account, address indexed borrower);

    /**
     *  @dev Cancel vouching for other member event
     *  @param account New member's voucher address
     *  @param borrower The address gets vouched for
     */
    event LogCancelVouch(address indexed account, address indexed borrower);

    /**
     *  @dev Stake event
     *  @param account The staker's address
     *  @param amount The amount of tokens to stake
     */
    event LogStake(address indexed account, uint256 amount);

    /**
     *  @dev Unstake event
     *  @param account The staker's address
     *  @param amount The amount of tokens to unstake
     */
    event LogUnstake(address indexed account, uint256 amount);

    /**
     *  @dev DebtWriteOff event
     *  @param staker The staker's address
     *  @param borrower The borrower's address
     *  @param amount The amount of write off
     */
    event LogDebtWriteOff(address indexed staker, address indexed borrower, uint256 amount);

    /**
     *  @dev set utoken address
     *  @param uToken new uToken address
     */
    event LogSetUToken(address uToken);

    /**
     *  @dev set new member fee
     *  @param oldMemberFee old member fee
     *  @param newMemberFee new member fee
     */
    event LogSetNewMemberFee(uint256 oldMemberFee, uint256 newMemberFee);

    /**
     *  @dev set max stake amount
     *  @param oldMaxStakeAmount Old amount
     *  @param newMaxStakeAmount New amount
     */
    event LogSetMaxStakeAmount(uint256 oldMaxStakeAmount, uint256 newMaxStakeAmount);

    /**
     *  @dev set max overdue time
     *  @param oldMaxOverdueTime Old value
     *  @param newMaxOverdueTime New value
     */
    event LogSetMaxOverdueTime(uint256 oldMaxOverdueTime, uint256 newMaxOverdueTime);

    /**
     *  @dev set effective count
     *  @param oldEffectiveCount Old value
     *  @param newEffectiveCount New value
     */
    event LogSetEffectiveCount(uint256 oldEffectiveCount, uint256 newEffectiveCount);

    /**
     * @dev Set max voucher
     * @param maxVouchers new max voucher limit
     */
    event LogSetMaxVouchers(uint256 maxVouchers);

    /**
     * @dev Set max vouchees
     * @param maxVouchees new max voucher limit
     */
    event LogSetMaxVouchees(uint256 maxVouchees);

    event LogChangeUnionToken(address oldUnionToken, address newUnionToken);

    /* -------------------------------------------------------------------
      Constructor/Initializer 
    ------------------------------------------------------------------- */

    function __UserManager_init(
        address assetManager_,
        address unionToken_,
        address stakingToken_,
        address comptroller_,
        address admin_,
        uint256 maxOverdueTime_,
        uint256 effectiveCount_,
        uint256 maxVouchers_,
        uint256 maxVouchees_
    ) public initializer {
        Controller.__Controller_init(admin_);
        ReentrancyGuardUpgradeable.__ReentrancyGuard_init();
        comptroller = IComptroller(comptroller_);
        assetManager = assetManager_;
        unionToken = unionToken_;
        stakingToken = stakingToken_;
        newMemberFee = 1 ether;
        maxStakeAmount = 10_000e18;
        maxOverdueTime = maxOverdueTime_;
        effectiveCount = effectiveCount_;
        maxVouchers = maxVouchers_;
        maxVouchees = maxVouchees_;
    }

    /* -------------------------------------------------------------------
      Modifiers 
    ------------------------------------------------------------------- */

    modifier onlyMember(address account) {
        if (!checkIsMember(account)) revert AuthFailed();
        _;
    }

    modifier onlyMarket() {
        if (address(uToken) != msg.sender) revert AuthFailed();
        _;
    }

    /* -------------------------------------------------------------------
      Setters 
    ------------------------------------------------------------------- */

    /**
     * @dev Set the max amount that a user can stake
     * Emits {LogSetMaxStakeAmount} event
     * @param maxStakeAmount_ The max stake amount
     */
    function setMaxStakeAmount(uint96 maxStakeAmount_) external onlyAdmin {
        uint96 oldMaxStakeAmount = maxStakeAmount;
        maxStakeAmount = maxStakeAmount_;
        emit LogSetMaxStakeAmount(uint256(oldMaxStakeAmount), uint256(maxStakeAmount));
    }

    /**
     * @dev set the UToken contract address
     * Emits {LogSetUToken} event
     * @param uToken_ UToken contract address
     */
    function setUToken(address uToken_) external onlyAdmin {
        uToken = IUToken(uToken_);
        emit LogSetUToken(uToken_);
    }

    /**
     * @dev set New Member fee
     * @dev The amount of UNION an account must burn to become a member
     * Emits {LogSetNewMemberFee} event
     * @param amount New member fee amount
     */
    function setNewMemberFee(uint256 amount) external onlyAdmin {
        uint256 oldMemberFee = newMemberFee;
        newMemberFee = amount;
        emit LogSetNewMemberFee(oldMemberFee, amount);
    }

    /**
     * @dev set New max overdue timestamp
     * Emits {LogSetMaxOverdueTime} event
     * @param _maxOverdueTime New maxOverdueTime value
     */
    function setMaxOverdueTime(uint256 _maxOverdueTime) external onlyAdmin {
        uint256 oldMaxOverdueTime = maxOverdueTime;
        maxOverdueTime = _maxOverdueTime;
        emit LogSetMaxOverdueTime(oldMaxOverdueTime, _maxOverdueTime);
    }

    /**
     * @dev set New effective count
     * @dev this is the number of vouches an account needs in order
     *      to register as a member
     * Emits {LogSetEffectiveCount} event
     * @param _effectiveCount New effectiveCount value
     */
    function setEffectiveCount(uint256 _effectiveCount) external onlyAdmin {
        uint256 oldEffectiveCount = effectiveCount;
        effectiveCount = _effectiveCount;
        emit LogSetEffectiveCount(oldEffectiveCount, _effectiveCount);
    }

    function setMaxVouchers(uint256 _maxVouchers) external onlyAdmin {
        maxVouchers = _maxVouchers;
        emit LogSetMaxVouchers(_maxVouchers);
    }

    function setMaxVouchees(uint256 _maxVouchees) external onlyAdmin {
        maxVouchees = _maxVouchees;
        emit LogSetMaxVouchees(_maxVouchees);
    }

    /* -------------------------------------------------------------------
      View Functions 
    ------------------------------------------------------------------- */

    /**
     *  @dev Check if the account is a valid member
     *  @param account Member address
     *  @return Address whether is member
     */
    function checkIsMember(address account) public view returns (bool) {
        return stakers[account].isMember;
    }

    /**
     *  @dev  Get the member's available credit limit
     *  @dev  ////IMPORTANT: This function can take up a tonne of gas as the vouchers[address] array
     *        grows in size. the maxVoucher limit will ensure this function can always run within a
     *        single block but it is intended only to be used as a view function called from a UI
     *  @param borrower Member address
     *  @return total Credit line amount
     */
    function getCreditLimit(address borrower) external view returns (uint256 total) {
        for (uint256 i = 0; i < vouchers[borrower].length; i++) {
            Vouch memory vouch = vouchers[borrower][i];
            Staker memory staker = stakers[vouch.staker];
            total += _min(staker.stakedAmount - staker.locked, vouch.trust - vouch.locked);
        }
    }

    /**
     *  @dev  Get the count of vouchers
     *        Vouchers are addresses that this borrower is receiving a vouch from.
     *  @param borrower Address of borrower
     */
    function getVoucherCount(address borrower) external view returns (uint256) {
        return vouchers[borrower].length;
    }

    /**
     *  @dev  Get the count of vouchees
     *        Vouchers are addresses that this staker is vouching for
     *  @param staker Address of staker
     */
    function getVoucheeCount(address staker) external view returns (uint256) {
        return vouchees[staker].length;
    }

    /**
     *  @dev Get the user's deposited stake amount
     *  @param account Member address
     *  @return Deposited stake amount
     */
    function getStakerBalance(address account) external view returns (uint256) {
        return stakers[account].stakedAmount;
    }

    /**
     *  @dev Get Total locked stake
     *  @param staker Staker address
     */
    function getTotalLockedStake(address staker) external view returns (uint256) {
        return stakers[staker].locked;
    }

    /**
     *  @dev Get staker locked stake for a borrower
     *  @param staker Staker address
     *  @param borrower Borrower address
     *  @return LockedStake
     */
    function getLockedStake(address staker, address borrower) external view returns (uint256) {
        Index memory index = voucherIndexes[borrower][staker];
        if (!index.isSet) return 0;
        return vouchers[borrower][index.idx].locked;
    }

    /**
     *  @dev Get vouching amount
     *  @param _staker Staker address
     *  @param borrower Borrower address
     */
    function getVouchingAmount(address _staker, address borrower) external view returns (uint256) {
        Index memory index = voucherIndexes[borrower][_staker];
        Staker memory staker = stakers[_staker];
        if (!index.isSet) return 0;
        uint96 trustAmount = vouchers[borrower][index.idx].trust;
        return trustAmount < staker.stakedAmount ? trustAmount : staker.stakedAmount;
    }

    /* -------------------------------------------------------------------
      Core Functions 
    ------------------------------------------------------------------- */

    /**
     *  @dev Manually add union members and bypass all the requirements of `registerMember`
     *  Only accepts calls from the admin
     *  Emit {LogAddMember} event
     *  @param account Member address
     */
    function addMember(address account) external onlyAdmin {
        stakers[account].isMember = true;
        emit LogAddMember(account);
    }

    /**
     *  @dev  Update the trust amount for existing members.
     *  @dev  Trust is the amount of the underlying token you would in theory be
     *        happy to lend to another member. Vouch is derived from trust and stake.
     *        Vouch is the minimum of trust and staked amount.
     *  Emits {LogUpdateTrust} event
     *  @param borrower Account address
     *  @param trustAmount Trust amount
     */
    function updateTrust(address borrower, uint96 trustAmount) external onlyMember(msg.sender) whenNotPaused {
        address staker = msg.sender;
        if (borrower == staker) revert ErrorSelfVouching();

        // Check if this staker is already vouching for this borrower
        // If they are already vouching then update the existing vouch record
        // If this is a new vouch then insert a new Vouch record
        Index memory index = voucherIndexes[borrower][staker];
        if (index.isSet) {
            // Update existing record checking that the new trust amount is
            // not less than the amount of stake currently locked by the borrower
            Vouch storage vouch = vouchers[borrower][index.idx];
            if (trustAmount < vouch.locked) revert TrustAmountLtLocked();
            vouch.trust = trustAmount;
        } else {
            // If the member is overdue they cannot create new vouches they can
            // only update existing vouches
            if (uToken.checkIsOverdue(staker)) revert VouchWhenOverdue();

            // This is a new vouch so we need to check that the
            // member has not reached the max voucher limit
            uint256 voucheeIndex = vouchees[staker].length;
            if (voucheeIndex >= maxVouchees) revert MaxVouchees();

            // Get the new index that this vouch is going to be inserted at
            // Then update the voucher indexes for this borrower as well as
            // Adding the Vouch the the vouchers array for this staker
            uint256 voucherIndex = vouchers[borrower].length;
            if (voucherIndex >= maxVouchers) revert MaxVouchers();
            voucherIndexes[borrower][staker] = Index(true, voucherIndex.toUint128());
            vouchers[borrower].push(Vouch(staker, trustAmount, 0, 0));

            // Add the voucherIndex of this new vouch to the vouchees array for this
            // staker then update the voucheeIndexes with the voucheeIndex
            vouchees[staker].push(Vouchee(borrower, voucherIndex.toUint96()));
            voucheeIndexes[borrower][staker] = Index(true, voucheeIndex.toUint128());
        }

        emit LogUpdateTrust(staker, borrower, trustAmount);
    }

    /**
     *  @dev Remove voucher for member
     *  Can be called by either the borrower or the staker. It will remove the voucher from
     *  the voucher array by replacing it with the last item of the array and resting the array
     *  size to -1 by popping off the last item
     *  Only callable by a member when the contract is not paused
     *  Emit {LogCancelVouch} event
     *  @param staker Staker address
     *  @param borrower borrower address
     */
    function _cancelVouchInternal(address staker, address borrower) internal {
        Index memory removeVoucherIndex = voucherIndexes[borrower][staker];
        if (!removeVoucherIndex.isSet) revert VoucherNotFound();

        // Check that the locked amount for this vouch is 0
        Vouch memory vouch = vouchers[borrower][removeVoucherIndex.idx];
        if (vouch.locked > 0) revert LockedStakeNonZero();

        // Remove borrower from vouchers array by moving the last item into the position
        // of the index being removed and then popping the last item off the array
        {
            // Cache the last voucher
            Vouch memory lastVoucher = vouchers[borrower][vouchers[borrower].length - 1];
            // Move the lastVoucher to the index of the voucher we are removing
            vouchers[borrower][removeVoucherIndex.idx] = lastVoucher;
            // Pop the last vouch off the end of the vouchers array
            vouchers[borrower].pop();
            // Delete the voucher index for this borrower => staker pair
            delete voucherIndexes[borrower][staker];
            // Update the last vouchers corresponding Vouchee item
            uint128 voucheeIdx = voucheeIndexes[borrower][lastVoucher.staker].idx;
            vouchees[lastVoucher.staker][voucheeIdx].voucherIndex = removeVoucherIndex.idx.toUint96();
            // Update the voucher indexes of the moved pair to the new voucher index
            voucherIndexes[borrower][lastVoucher.staker].idx = removeVoucherIndex.idx;
        }

        // Update the vouchee entry for this borrower => staker pair
        {
            Index memory removeVoucheeIndex = voucheeIndexes[borrower][staker];
            // Cache the last vouchee
            Vouchee memory lastVouchee = vouchees[staker][vouchees[staker].length - 1];
            // Move the last vouchee to the index of the removed vouchee
            vouchees[staker][removeVoucheeIndex.idx] = lastVouchee;
            // Pop the last vouchee off the end of the vouchees array
            vouchees[staker].pop();
            // Delete the vouchee index for this borrower => staker pair
            delete voucheeIndexes[borrower][staker];
            // Update the vouchee indexes to the new vouchee index
            voucheeIndexes[lastVouchee.borrower][staker].idx = removeVoucheeIndex.idx;
        }

        emit LogCancelVouch(staker, borrower);
    }

    /**
     *  Cancels a vouch between a staker and a borrower.
     *  @dev The function can only be called by a member of the stakers list.
     *  @param staker The address of the staker who made the vouch.
     *  @param borrower The address of the borrower who received the vouch.
     */
    function cancelVouch(address staker, address borrower) public onlyMember(msg.sender) whenNotPaused {
        if (staker != msg.sender && borrower != msg.sender) revert AuthFailed();
        _cancelVouchInternal(staker, borrower);
    }

    /**
     *  @notice Register a a member using a signed permit
     *  @dev See registerMember
     *  @param newMember New member address
     *  @param value Amount approved by permit
     *  @param deadline Timestamp for when the permit expires
     *  @param v secp256k1 signature part
     *  @param r secp256k1 signature part
     *  @param s secp256k1 signature part
     */
    function registerMemberWithPermit(
        address newMember,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external whenNotPaused {
        IUnionToken(unionToken).permit(msg.sender, address(this), value, deadline, v, r, s);
        registerMember(newMember);
    }

    /**
     *  @notice Register a a member, and burn the application fee
     *  @dev    In order to register as a member an address must be receiving x amount
     *          of vouches greater than 0 from stakers. x is defined by `effectiveCount`
     *          Emits {LogRegisterMember} event
     *  @param newMember New member address
     */
    function registerMember(address newMember) public virtual whenNotPaused {
        _validateNewMember(newMember);

        IUnionToken(unionToken).burnFrom(msg.sender, newMemberFee);

        emit LogRegisterMember(msg.sender, newMember);
    }

    /**
     *  @notice Stake staking tokens
     *  @dev    Stake is used to underwrite loans and becomes locked if a
     *          member a staker has vouched for borrows against it.
     *          Stake also earns rewards from the comptroller
     *  Emits a {LogStake} event.
     *  @param amount Amount to stake
     */
    function stake(uint96 amount) public whenNotPaused nonReentrant {
        IERC20Upgradeable erc20Token = IERC20Upgradeable(stakingToken);

        comptroller.withdrawRewards(msg.sender, stakingToken);

        Staker storage staker = stakers[msg.sender];

        if (staker.stakedAmount + amount > maxStakeAmount) revert StakeLimitReached();

        staker.stakedAmount += amount;
        totalStaked += amount;

        erc20Token.safeTransferFrom(msg.sender, address(this), amount);
        uint256 currentAllowance = erc20Token.allowance(address(this), assetManager);
        if (currentAllowance < amount) {
            erc20Token.safeIncreaseAllowance(assetManager, amount - currentAllowance);
        }

        if (!IAssetManager(assetManager).deposit(stakingToken, amount)) revert AssetManagerDepositFailed();
        emit LogStake(msg.sender, amount);
    }

    /**
     *  @notice Unstake staking token
     *  @dev    Tokens can only be unstaked if they are not locked. ie a
     *          vouchee is not borrowing against them.
     *  Emits {LogUnstake} event
     *  @param amount Amount to unstake
     */
    function unstake(uint96 amount) external whenNotPaused nonReentrant {
        Staker storage staker = stakers[msg.sender];

        // Stakers can only unstaked stake balance that is unlocked. Stake balance
        // becomes locked when it is used to underwrite a borrow.
        if (staker.stakedAmount - staker.locked < amount) revert InsufficientBalance();

        comptroller.withdrawRewards(msg.sender, stakingToken);

        uint256 remaining = IAssetManager(assetManager).withdraw(stakingToken, msg.sender, amount);
        if (remaining > amount) {
            revert AssetManagerWithdrawFailed();
        }
        uint96 actualAmount = amount - remaining.toUint96();

        staker.stakedAmount -= actualAmount;
        totalStaked -= actualAmount;

        emit LogUnstake(msg.sender, actualAmount);
    }

    /**
     *  @dev collect staker rewards from the comptroller
     */
    function withdrawRewards() external whenNotPaused nonReentrant {
        comptroller.withdrawRewards(msg.sender, stakingToken);
    }

    /**
     *  @notice Write off a borrowers debt
     *  @dev    Used the stakers locked stake to write off the loan, transferring the
     *          Stake to the AssetManager and adjusting balances in the AssetManager
     *          and the UToken to repay the principal
     *  @dev    Emits {LogDebtWriteOff} event
     *  @param stakerAddress address of staker
     *  @param borrowerAddress address of borrower
     *  @param amount amount to writeoff
     */
    function debtWriteOff(
        address stakerAddress,
        address borrowerAddress,
        uint256 amount
    ) external {
        if (amount == 0) revert AmountZero();
        uint256 overdueTime = uToken.overdueTime();
        uint256 lastRepay = uToken.getLastRepay(borrowerAddress);
        uint256 currTime = getTimestamp();

        // This function is only callable by the public if the loan is overdue by
        // overdue time + maxOverdueTime. This stops the system being left with
        // debt that is overdue indefinitely and no ability to do anything about it.
        if (currTime <= lastRepay + overdueTime + maxOverdueTime) {
            if (stakerAddress != msg.sender) revert AuthFailed();
        }

        Index memory index = voucherIndexes[borrowerAddress][stakerAddress];
        if (!index.isSet) revert VoucherNotFound();
        Vouch storage vouch = vouchers[borrowerAddress][index.idx];
        uint256 locked = vouch.locked;
        if (amount > locked) revert ExceedsLocked();

        comptroller.accrueRewards(stakerAddress, stakingToken);

        Staker storage staker = stakers[stakerAddress];

        staker.stakedAmount -= amount.toUint96();
        staker.locked -= amount.toUint96();
        staker.lastUpdated = currTime.toUint64();

        totalStaked -= amount;

        // update vouch trust amount
        vouch.trust -= amount.toUint96();
        vouch.locked -= amount.toUint96();
        vouch.lastUpdated = currTime.toUint64();

        // Update total frozen and member frozen. We don't want to move th
        // burden of calling updateFrozenInfo into this function as it is quite
        // gas intensive. Instead we just want to remove the amount that was
        // frozen which is now being written off. However, it is possible that
        // member frozen has not been updated prior to calling debtWriteOff and
        // the amount being written off could be greater than the amount frozen.
        // To avoid an underflow here we need to check this condition
        uint256 stakerFrozen = memberFrozen[stakerAddress];
        if (amount > stakerFrozen) {
            // The amount being written off is more than the amount that has
            // been previously frozen for this staker. Reset their frozen stake
            // to zero and adjust totalFrozen
            memberFrozen[stakerAddress] = 0;
            totalFrozen -= stakerFrozen;
        } else {
            totalFrozen -= amount;
            memberFrozen[stakerAddress] -= amount;
        }

        if (vouch.trust == 0) {
            _cancelVouchInternal(stakerAddress, borrowerAddress);
        }

        // Notify the AssetManager and the UToken market of the debt write off
        // so they can adjust their balances accordingly
        IAssetManager(assetManager).debtWriteOff(stakingToken, amount);
        uToken.debtWriteOff(borrowerAddress, amount);
        emit LogDebtWriteOff(msg.sender, borrowerAddress, amount);
    }

    /**
     *  @notice Borrowing from the market
     *  @dev    Locks/Unlocks the borrowers stakers staked amounts in a first in
     *          First out order. Meaning the members that vouched for this borrower
     *          first will be the first members to get their stake locked or unlocked
     *          following a borrow or repayment.
     *  @param borrower The address of the borrower
     *  @param amount Lock/Unlock amount
     *  @param lock If the amount is being locked or unlocked
     */
    function updateLocked(
        address borrower,
        uint256 amount,
        bool lock
    ) external onlyMarket {
        uint96 remaining = (amount).toUint96();
        uint96 innerAmount = 0;
        Staker storage staker;
        uint256 currTime = getTimestamp();

        uint256 vouchersLength = vouchers[borrower].length;
        for (uint256 i = 0; i < vouchersLength; i++) {
            Vouch storage vouch = vouchers[borrower][i];
            staker = stakers[vouch.staker];

            staker.lockedCoinAge += _calcLockedCoinAge(currTime, vouch.locked, staker.lastUpdated, vouch.lastUpdated);

            vouch.lastUpdated = currTime.toUint64();
            if (lock) {
                // Look up the staker and determine how much unlock stake they
                // have available for the borrower to borrow. If there is 0
                // then continue to the next voucher in the array
                uint96 availableStake = staker.stakedAmount - staker.locked;
                uint96 lockAmount = _min(availableStake, vouch.trust - vouch.locked);
                if (lockAmount == 0) continue;
                // Calculate the amount to add to the lock then
                // add the extra amount to lock to the stakers locked amount
                // and also update the vouches locked amount and lastUpdated timestamp
                innerAmount = _min(remaining, lockAmount);
                staker.locked += innerAmount;
                vouch.locked += innerAmount;
            } else {
                // Look up how much this vouch has locked. If it is 0 then
                // continue to the next voucher. Then calculate the amount to
                // unlock which is the min of the vouches lock and what is
                // remaining to unlock
                uint96 locked = vouch.locked;
                if (locked == 0) continue;
                innerAmount = _min(locked, remaining);
                // Update the stored locked values and last updated timestamp
                staker.locked -= innerAmount;
                vouch.locked -= innerAmount;
            }

            remaining -= innerAmount;
            // If there is no remaining amount to lock/unlock
            // we can stop looping through vouchers
            if (remaining <= 0) break;
        }

        // If we have looped through all the available vouchers for this
        // borrower and we still have a remaining amount then we have to
        // revert as there is not enough vouchers to lock/unlock
        if (remaining > 0) revert LockedRemaining();
    }

    /**
     * @dev Get the staker's latest info based on stored coinage
     * @param stakerAddress Staker address
     * @return  user's effective staked amount
     * @return  user's effective locked amount
     * @return  user's frozen amount
     */
    function _getEffectiveAmounts(address stakerAddress)
        private
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        Staker memory staker = stakers[stakerAddress];
        uint256 currTime = getTimestamp();

        CoinAge memory stakerCoinAges = CoinAge({
            stakedCoinAge: staker.stakedCoinAge,
            lockedCoinAge: staker.lockedCoinAge,
            frozenCoinAge: frozenCoinAge[stakerAddress],
            sinceLastWithdrawRewards: currTime - gLastWithdrawRewards[stakerAddress]
        });

        // update staked coin age
        stakerCoinAges.stakedCoinAge += _calcStakedCoinAge(currTime, staker.stakedAmount, staker.lastUpdated);

        // Loop through all of the stakers vouchees sum their total
        // locked balance and sum their total currDefaultFrozenCoinAge
        uint256 voucheesLength = vouchees[stakerAddress].length;
        uint256 lastRepay = 0;
        uint256 stakerFrozen = 0;
        Vouchee memory vouchee;
        Vouch memory vouch;
        uint256 overdueTime = uToken.overdueTime();
        for (uint256 i = 0; i < voucheesLength; i++) {
            // Get the vouchee record and look up the borrowers voucher record
            // to get the locked amount and lastUpdated time
            vouchee = vouchees[stakerAddress][i];
            vouch = vouchers[vouchee.borrower][vouchee.voucherIndex];

            // update locked coin age
            stakerCoinAges.lockedCoinAge += _calcLockedCoinAge(
                currTime,
                vouch.locked,
                staker.lastUpdated,
                vouch.lastUpdated
            );

            // update frozen coin age
            lastRepay = uToken.getLastRepay(vouchee.borrower);
            if (
                (// skip the member never staked
                staker.lastUpdated != 0 &&
                    // skip the debt all repaid
                    lastRepay != 0)
            ) {
                if (currTime - lastRepay > overdueTime) // for the debt overdue
                {
                    stakerFrozen += vouch.locked;
                    stakerCoinAges.frozenCoinAge += _calcFrozenCoinAge(
                        currTime,
                        vouch.locked,
                        staker.lastUpdated,
                        lastRepay + overdueTime
                    );
                }
            }
        }

        if (stakerCoinAges.sinceLastWithdrawRewards == 0) {
            return (
                staker.stakedAmount - stakerFrozen, // effective staked
                staker.locked - stakerFrozen, // effective locked
                stakerFrozen
            );
        } else {
            return (
                // staker's total effective staked = (staked coinage - frozen coinage) / (time since last rewards withdrawal)
                (stakerCoinAges.stakedCoinAge - stakerCoinAges.frozenCoinAge) / stakerCoinAges.sinceLastWithdrawRewards,
                // effective locked amount = (locked coinage - frozen coinage) / (time since last rewards withdrawal)
                (stakerCoinAges.lockedCoinAge - stakerCoinAges.frozenCoinAge) / stakerCoinAges.sinceLastWithdrawRewards,
                stakerFrozen
            );
        }
    }

    /**
     *  @dev Get the staker's effective staked and locked amount
     *  @param staker Staker address
     *  @return isMember
     *          effectiveStaked user's effective staked amount
     *          effectiveLocked user's effective locked amount
     *          staker's total frozen amount
     */
    function getStakeInfo(address staker)
        external
        view
        returns (
            bool isMember,
            uint256 effectiveStaked,
            uint256 effectiveLocked,
            uint256 stakerFrozen
        )
    {
        (effectiveStaked, effectiveLocked, stakerFrozen) = _getEffectiveAmounts(staker);
        isMember = stakers[staker].isMember;
    }

    /**
     * @dev Update the frozen info by the comptroller when withdraw rewards is called
     * @param staker Staker address
     * @return  effectiveStaked user's total stake - frozen
     *          effectiveLocked user's locked amount - frozen
     *          isMember
     */
    function onWithdrawRewards(address staker)
        external
        returns (
            uint256 effectiveStaked,
            uint256 effectiveLocked,
            bool isMember
        )
    {
        if (address(comptroller) != msg.sender) revert AuthFailed();
        uint256 memberTotalFrozen = 0;
        (effectiveStaked, effectiveLocked, memberTotalFrozen) = _getEffectiveAmounts(staker);
        stakers[staker].stakedCoinAge = 0;
        uint256 currTime = getTimestamp();
        stakers[staker].lastUpdated = currTime.toUint64();
        gLastWithdrawRewards[staker] = currTime;
        stakers[staker].lockedCoinAge = 0;
        frozenCoinAge[staker] = 0;

        uint256 memberFrozenBefore = memberFrozen[staker];
        if (memberFrozenBefore != memberTotalFrozen) {
            memberFrozen[staker] = memberTotalFrozen;
            totalFrozen = totalFrozen - memberFrozenBefore + memberTotalFrozen;
        }

        isMember = stakers[staker].isMember;
    }

    /**
     * @dev Make sure only update the frozen info when borrower's overdue
     * @param borrower Borrower address
     * @param overdueTime Timestamp since last repay
     */
    function onRepayBorrow(address borrower, uint256 overdueTime) external {
        if (address(uToken) != msg.sender) revert AuthFailed();

        Vouch[] memory borrowerVouchers = vouchers[borrower];
        uint256 vouchersLength = borrowerVouchers.length;
        Vouch memory vouch;
        uint256 currTime = getTimestamp();
        // assuming the borrower's already overdue, accumulating all his vouchers' previous frozen coin age
        for (uint256 i = 0; i < vouchersLength; i++) {
            vouch = borrowerVouchers[i];
            if (vouch.locked == 0) continue;
            frozenCoinAge[vouch.staker] += _calcFrozenCoinAge(
                currTime,
                vouch.locked,
                stakers[vouch.staker].lastUpdated,
                overdueTime
            );
        }
    }

    /**
     * @dev Update the frozen info for external scripts
     * @param stakerList Stakers address
     */
    function batchUpdateFrozenInfo(address[] calldata stakerList) external whenNotPaused {
        uint256 stakerLength = stakerList.length;
        if (stakerLength == 0) revert InvalidParams();

        // update member's frozen amount and global frozen amount
        uint256 tmpTotalFrozen = totalFrozen;
        address staker = address(0);
        for (uint256 i = 0; i < stakerLength; i++) {
            staker = stakerList[i];
            (, , uint256 memberTotalFrozen) = _getEffectiveAmounts(staker);

            uint256 memberFrozenBefore = memberFrozen[staker];
            if (memberFrozenBefore != memberTotalFrozen) {
                memberFrozen[staker] = memberTotalFrozen;
                tmpTotalFrozen = tmpTotalFrozen - memberFrozenBefore + memberTotalFrozen;
            }
        }
        totalFrozen = tmpTotalFrozen;

        comptroller.updateTotalStaked(stakingToken, totalStaked - totalFrozen);
    }

    function globalTotalStaked() external view returns (uint256 globalTotal) {
        globalTotal = totalStaked - totalFrozen;
    }

    /* -------------------------------------------------------------------
       Internal Functions 
    ------------------------------------------------------------------- */

    function _min(uint96 a, uint96 b) private pure returns (uint96) {
        return a < b ? a : b;
    }

    function _max(uint256 a, uint256 b) private pure returns (uint256) {
        return a > b ? a : b;
    }

    function _validateNewMember(address newMember) internal {
        if (stakers[newMember].isMember) revert NoExistingMember();

        uint256 count = 0;
        uint256 vouchersLength = vouchers[newMember].length;
        Vouch memory vouch;
        Staker memory staker;

        // Loop through all the vouchers to count how many active vouches there
        // are that are greater than 0. Vouch is the min of stake and trust
        for (uint256 i = 0; i < vouchersLength; i++) {
            vouch = vouchers[newMember][i];
            staker = stakers[vouch.staker];
            if (staker.stakedAmount > 0) count++;
            if (count >= effectiveCount) break;
        }

        if (count < effectiveCount) revert NotEnoughStakers();

        stakers[newMember].isMember = true;
    }

    /**
     * @dev Calculate a staker's frozen coin age
     * @param currTime Current timestamp
     * @param locked Stakers locked amount
     * @param lastStakeUpdated Block timestamp when staked coin age is updated
     * @param overdueTime Loan over due period in seconds
     */
    function _calcFrozenCoinAge(
        uint256 currTime,
        uint256 locked,
        uint256 lastStakeUpdated,
        uint256 overdueTime
    ) private pure returns (uint256) {
        return locked * (currTime - _max(lastStakeUpdated, overdueTime));
    }

    /**
     * @dev Calculate a staker's locked coin age
     * @param currTime Current timestamp
     * @param locked Stakers locked amount
     * @param lastStakeUpdated Block timestamp when staked coin age is updated
     * @param lastLockedUpdated Block timestamp when locked coin age is updated
     */
    function _calcLockedCoinAge(
        uint256 currTime,
        uint256 locked,
        uint256 lastStakeUpdated,
        uint256 lastLockedUpdated
    ) private pure returns (uint256) {
        return locked * (currTime - _max(lastStakeUpdated, lastLockedUpdated));
    }

    /**
     * @dev Calculate a staker's staked coin age
     * @param currTime Current timestamp
     * @param stakedAmount Stakers staked amount
     * @param lastStakeUpdated Block timestamp when staked coin age is updated
     */
    function _calcStakedCoinAge(
        uint256 currTime,
        uint256 stakedAmount,
        uint256 lastStakeUpdated
    ) private pure returns (uint256) {
        return stakedAmount * (currTime - lastStakeUpdated);
    }

    /**
     *  @dev Function to simply retrieve block timestamp
     *  This exists mainly for inheriting test contracts to stub this result.
     */
    function getTimestamp() internal view returns (uint256) {
        return block.timestamp;
    }

    function changeUnionToken(address unionToken_) external onlyAdmin {
        address oldUnionToken = unionToken;
        unionToken = unionToken_;
        emit LogChangeUnionToken(oldUnionToken, unionToken);
    }
}
