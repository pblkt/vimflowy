import * as React from 'react';

import { BackendType } from '../../data_backend';
import { ClientStore } from '../../datastore';
import { getStyles } from '../../themes';

type Props = {
  clientStore: ClientStore;
  initialBackendType: BackendType;
};
type State = {
  backendType: BackendType,
};
export default class BackendSettingsComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      backendType: props.initialBackendType,
    };
  }

  private async saveDataSettings() {
    const clientStore = this.props.clientStore;
    const backendType = this.state.backendType;
    clientStore.setDocSetting('dataSource', backendType);

    window.location.reload();
  }

  private setBackendType(backendType: BackendType) {
    this.setState({ backendType } as State);
  }

  public render() {

    const backendTypes: Array<{
      name: string,
      type: 'Remote' | 'Local',
      value: BackendType,
      info: React.ReactElement<any> | string,
      config?: React.ReactElement<any>,
    }> = [
        {
          name: 'HTML5 Local Storage (default)',
          type: 'Local',
          value: 'local',
          info: `
          Stores data on your computer, through standard browser APIs.
          No backups, so you should export regularly.
          Clearing local storage will result in data loss.
        `,
        },
        {
          name: 'In-memory',
          type: 'Local',
          value: 'inmemory',
          info: `
          Not saved at all!
          Data loss as soon as you close the tab.
          Good for testing with complete throw-away data.
        `,
        },
      ];

    return (
      <div>
        <div style={{ marginBottom: 10 }}>
          <b> Local </b> data sources:
          <ul>
            <li>
              Offline access supported
            </li>
            <li>
              Data is never sent over the internet
            </li>
            <li>
              Can only be accessed from this browser
            </li>
          </ul>
        </div>
        <div style={{ marginBottom: 10 }}>
          <b> Remote </b> data sources:
          <ul>
            <li>
              Can be accessed from multiple devices or browsers
            </li>
            <li>
              No offline support
            </li>
          </ul>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th></th>
              <th style={{
                padding: 10,
                ...getStyles(this.props.clientStore, ['theme-trim'])
              }}>
                Storage Type
              </th>
              <th style={{
                padding: 10,
                ...getStyles(this.props.clientStore, ['theme-trim'])
              }}>
                Local/Remote
              </th>
              <th style={{
                padding: 10,
                ...getStyles(this.props.clientStore, ['theme-trim'])
              }}>
                Info
              </th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const rows: Array<React.ReactElement<any>> = [];
              backendTypes.forEach((backendTypeInfo) => {
                const selected = this.state.backendType === backendTypeInfo.value;
                rows.push(
                  <tr key={backendTypeInfo.value}>
                    <td style={{ padding: 10 }}>
                      <input type='radio' name='backendType'
                        value={backendTypeInfo.value} checked={selected} readOnly
                        onClick={(ev) => this.setBackendType((ev.target as HTMLInputElement).value as BackendType)}
                      />
                    </td>
                    <td style={{ padding: 10 }}>
                      <b>{backendTypeInfo.name}</b>
                    </td>
                    <td style={{ padding: 10 }}>
                      {backendTypeInfo.type}
                    </td>
                    <td style={{ padding: 10 }}>
                      {backendTypeInfo.info}
                    </td>
                  </tr>
                );

                if (selected && backendTypeInfo.config) {
                  rows.push(
                    <tr key='selected'>
                      <td></td>
                      <td colSpan={999}>
                        {backendTypeInfo.config}
                      </td>
                    </tr>
                  );
                }
              });
              return rows;
            })()}
          </tbody>
        </table>

        <div className='btn'
          style={{
            ...getStyles(this.props.clientStore, ['theme-bg-tertiary', 'theme-trim'])
          }}
          onClick={() => this.saveDataSettings()} >
          Load Data Settings
        </div>
        <h5 style={{ display: 'inline-block' }}>
          (WARNING: will reload page)
        </h5>
      </div>
    );
  }
}
