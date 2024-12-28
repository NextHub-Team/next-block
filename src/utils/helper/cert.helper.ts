import { readdirSync, statSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import { Logger } from '@nestjs/common';

/**
 * CertHelper is a utility class for loading and managing certificates in PEM, CRT, or KEY format
 * from the `config/certificates` directory. It is designed for internal usage within specific services
 * (e.g., `FireblocksService`) and is not intended for general-purpose certificate management.
 */
export class CertHelper {
  private static readonly logger = new Logger(CertHelper.name);
  private static readonly CERT_EXTENSIONS = ['.pem', '.crt', '.key'];
  private static readonly CERTS_DIR = join(
    __dirname,
    '../../config/certificates',
  );

  /**
   * Loads all certificates (PEM, CRT, KEY files) from the `config/certificates` directory.
   * This method scans the directory and returns the full paths of valid certificate files.
   *
   * @returns {string[]} - Array of certificate file paths.
   * @throws {Error} - If there is an error while reading the directory or files.
   */
  static loadAllCerts(): string[] {
    try {
      const files = readdirSync(this.CERTS_DIR);
      return files
        .filter(this.isValidCert)
        .map((file) => join(this.CERTS_DIR, file));
    } catch (error) {
      this.logger.error(
        `Error loading certificates from directory: ${this.CERTS_DIR}`,
        error.stack,
      );
      throw new Error('Could not load certificates.');
    }
  }

  /**
   * Filters files to check if they have a valid certificate extension (.pem, .crt, .key).
   *
   * @param file - The file name to check.
   * @returns {boolean} - True if the file has a valid certificate extension.
   */
  private static isValidCert(file: string): boolean {
    return this.CERT_EXTENSIONS.some((ext) => file.endsWith(ext));
  }

  /**
   * Retrieves details for a specific certificate file, such as its size and type.
   *
   * @param certPath - The full path to the certificate file.
   * @returns {Object} - An object containing the certificate's name, size, and type.
   * @throws {Error} - If there is an error retrieving the certificate details.
   */
  static getCertDetails(certPath: string): {
    fileName: string;
    size: number;
    type: string;
  } {
    try {
      const certStat = statSync(certPath);
      const fileType = this.getCertType(certPath);
      return {
        fileName: basename(certPath),
        size: certStat.size,
        type: fileType,
      };
    } catch (error) {
      this.logger.error(
        `Error getting certificate details for file: ${certPath}`,
        error.stack,
      );
      throw new Error(`Could not get certificate details for ${certPath}.`);
    }
  }

  /**
   * Determines the type of certificate based on the file extension.
   *
   * @param certPath - The full path to the certificate file.
   * @returns {string} - The certificate type (PEM, CRT, or KEY).
   */
  private static getCertType(certPath: string): string {
    if (certPath.endsWith('.pem')) return 'PEM';
    if (certPath.endsWith('.crt')) return 'CRT';
    if (certPath.endsWith('.key')) return 'KEY';
    return 'Unknown';
  }

  /**
   * Retrieves certificate details based on a partial file name.
   *
   * @param partialName - The partial name of the certificate file (e.g., "file.api").
   * @returns {Object | null} - An object containing the certificate details, or null if not found.
   * @throws {Error} - If there is an error reading files in the directory.
   */
  static getCertByPartialName(partialName: string): {
    fileName: string;
    size: number;
    type: string;
    content: string;
  } | null {
    try {
      const files = readdirSync(this.CERTS_DIR);
      const matchingFile = files.find(
        (file) => file.startsWith(partialName) && this.isValidCert(file),
      );

      if (!matchingFile) {
        this.logger.warn(
          `No certificate found for partial name: ${partialName}`,
        );
        return null;
      }

      const certPath = join(this.CERTS_DIR, matchingFile);
      const certStat = statSync(certPath);
      const fileType = this.getCertType(certPath);
      const content = readFileSync(certPath, 'utf8'); // Read the file content

      return {
        fileName: matchingFile,
        size: certStat.size,
        type: fileType,
        content,
      };
    } catch (error) {
      this.logger.error(
        `Error getting certificate by partial name: ${partialName}`,
        error.stack,
      );
      throw new Error(
        `Could not get certificate with partial name: ${partialName}`,
      );
    }
  }
}
