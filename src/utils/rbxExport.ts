// Generates real, schema-valid Roblox Studio .rbxmx XML files that import directly into Roblox Studio!

export interface ExportableScript {
  name: string;
  className: 'Script' | 'LocalScript' | 'ModuleScript';
  parentService: string;
  code: string;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapCdata(code: string): string {
  return `<![CDATA[${code.replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}

export function downloadRbxmxPackage(packageName: string, scripts: ExportableScript[]) {
  const grouped = new Map<string, ExportableScript[]>();
  for (const sc of scripts) {
    const list = grouped.get(sc.parentService) || [];
    list.push(sc);
    grouped.set(sc.parentService, list);
  }

  let refCounter = 1000;
  const nextRef = () => `RBX${++refCounter}`;

  let foldersXml = '';
  for (const [serviceName, items] of grouped.entries()) {
    let itemsXml = '';
    for (const item of items) {
      itemsXml += `
      <Item class="${item.className}" referent="${nextRef()}">
        <Properties>
          <string name="Name">${escapeXml(item.name)}</string>
          <ProtectedString name="Source">${wrapCdata(item.code)}</ProtectedString>
        </Properties>
      </Item>`;
    }
    foldersXml += `
    <Item class="Folder" referent="${nextRef()}">
      <Properties>
        <string name="Name">Place_In_${escapeXml(serviceName)}</string>
      </Properties>${itemsXml}
    </Item>`;
  }

  const xml = `<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">
  <Meta name="ExplicitAutoJoints">true</Meta>
  <External>null</External>
  <External>nil</External>
  <Item class="Folder" referent="${nextRef()}">
    <Properties>
      <string name="Name">${escapeXml(packageName)}_BaseplateAI</string>
    </Properties>${foldersXml}
  </Item>
</roblox>`;

  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeFile = packageName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'BaseplateSystem';
  a.href = url;
  a.download = `${safeFile}.rbxmx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2500);
}
