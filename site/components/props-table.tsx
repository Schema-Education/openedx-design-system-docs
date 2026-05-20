/**
 * PropsTable — stub component.
 *
 * TODO: Phase 2b — wire this to the react-docgen pipeline.
 *
 * When the prop extraction pipeline ships, `props` will be automatically
 * populated from the react-docgen output stored in the component manifest.
 * This component will then render a full interactive props reference table.
 */

export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

interface PropsTableProps {
  /** Array of prop definitions — will be auto-populated by the docgen pipeline */
  props: PropDefinition[];
  /** Component name shown in the table header */
  componentName?: string;
}

/**
 * Renders a table of prop definitions.
 * Currently a basic placeholder; will become interactive in Phase 2b.
 */
export function PropsTable({ props, componentName }: PropsTableProps) {
  if (props.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-6 text-center text-sm text-gray-600">
        {/* TODO: Phase 2b — populate via react-docgen extraction pipeline */}
        Props documentation for {componentName ?? 'this component'} is coming
        in Phase 2b.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">
              Prop
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">
              Required
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="px-4 py-3 font-mono text-xs text-gray-800">
                {prop.name}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-primary-700">
                {prop.type}
              </td>
              <td className="px-4 py-3 text-xs">
                {prop.required ? (
                  <span className="rounded-full bg-danger-light px-2 py-0.5 text-danger-dark">
                    required
                  </span>
                ) : (
                  <span className="text-gray-600">optional</span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500">
                {prop.defaultValue ?? '—'}
              </td>
              <td className="px-4 py-3 text-xs text-gray-600">
                {prop.description ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PropsTable;
