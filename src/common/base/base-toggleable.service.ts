import { ServiceUnavailableException, Logger } from '@nestjs/common';

/**
 * Base class for services that can be toggled enabled/disabled.
 */
export abstract class BaseToggleableService {
  protected readonly logger: Logger;
  private _isEnabled: boolean;

  constructor(serviceName: string, isEnabled: boolean) {
    this.logger = new Logger(serviceName);
    this._isEnabled = isEnabled;

    this.logEnabledStatus();
  }

  /**
   * Enable or disable the service at runtime.
   * Logs whenever the state actually changes.
   */
  setEnabled(enabled: boolean): void {
    const previous = this._isEnabled;
    this._isEnabled = enabled;

    if (previous !== enabled) {
      this.logEnabledStatus();
    }
  }

  /** Returns the current enabled flag. */
  getEnabled(): boolean {
    return this._isEnabled;
  }

  /** Allow inheritors to access the live enabled flag as a property. */
  protected get isEnabled(): boolean {
    return this._isEnabled;
  }

  /**
   * Deprecated: Use checkIfEnabled() instead.
   */
  protected throwIfDisabled(): void {
    // Deprecated: Use checkIfEnabled() instead.
    if (!this._isEnabled) {
      throw new ServiceUnavailableException('Service is disabled internally.');
    }
  }

  /**
   * Checks if the service is enabled; if not, logs and throws an error.
   */
  protected checkIfEnabled(): void {
    if (!this._isEnabled) {
      this.logger.warn('Operation attempted but service is DISABLED.');
      throw new ServiceUnavailableException('Service is disabled.');
    }
  }

  /**
   * Logs whether the service is enabled or disabled.
   */
  protected logEnabledStatus(): void {
    if (this._isEnabled) {
      this.logger.log('Service is ENABLED.');
    } else {
      this.logger.warn('Service is DISABLED.');
    }
  }
}
