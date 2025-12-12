import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("cockpit");

  const [lcData, setLcData] = useState({
    generalCleaning: false,
    unexpectedHours: 0,
    bonusOnce: 0,
    comment: "",
  });

  const [staffingM0, setStaffingM0] = useState({
    ptPercent: 35,
    ftProductivity: 160,
    ptProductivity: 80,
    trainerCoef: 0.1,
  });

  const [staffingM1, setStaffingM1] = useState({
    ptPercent: 35,
    ftProductivity: 160,
    ptProductivity: 80,
  });

  const [staffingM2, setStaffingM2] = useState({
    ptPercent: 35,
    ftProductivity: 160,
    ptProductivity: 80,
  });

  const calculateLC = () => {
    const baseLC = 28.5;
    const unexpectedImpact = (lcData.unexpectedHours * 450) / 1000000;
    const bonusImpact = lcData.bonusOnce / 100000;
    const cleaningImpact = lcData.generalCleaning ? 0.3 : 0;
    
    return (baseLC + unexpectedImpact + bonusImpact + cleaningImpact).toFixed(1);
  };

  const calculateStaffing = (data: typeof staffingM0) => {
    const totalHours = 4800;
    const ftHours = totalHours * (1 - data.ptPercent / 100);
    const ptHours = totalHours * (data.ptPercent / 100);
    
    const ftStaff = ftHours / data.ftProductivity;
    const ptStaff = ptHours / data.ptProductivity;
    
    return {
      ftStaff: ftStaff.toFixed(1),
      ptStaff: ptStaff.toFixed(1),
      totalStaff: (ftStaff + ptStaff).toFixed(1),
      ftHours: ftHours.toFixed(0),
      ptHours: ptHours.toFixed(0),
    };
  };

  const lcValue = parseFloat(calculateLC());
  const lcBudget = 29.0;
  const lcDelta = lcValue - lcBudget;

  const handleLcUpdate = (field: string, value: any) => {
    setLcData({ ...lcData, [field]: value });
    toast({
      title: "Данные обновлены",
      description: "LC пересчитан автоматически",
    });
  };

  const staffingResultM0 = calculateStaffing(staffingM0);
  const staffingResultM1 = calculateStaffing(staffingM1);
  const staffingResultM2 = calculateStaffing(staffingM2);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Icon name="BarChart3" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Labor Cost Planning</h1>
                <p className="text-sm text-muted-foreground">Ресторан #147 • Москва Тверская</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                <Icon name="User" size={14} className="mr-1" />
                Директор
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="cockpit" className="gap-2">
              <Icon name="LayoutDashboard" size={16} />
              Cockpit
            </TabsTrigger>
            <TabsTrigger value="plan" className="gap-2">
              <Icon name="FileText" size={16} />
              План LC
            </TabsTrigger>
            <TabsTrigger value="staffing" className="gap-2">
              <Icon name="Users" size={16} />
              Staffing ЧБР
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cockpit" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-primary/20">
                <CardHeader className="pb-3">
                  <CardDescription>LC План</CardDescription>
                  <CardTitle className="text-3xl">{lcValue}%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant={lcDelta > 0 ? "destructive" : "default"}>
                      {lcDelta > 0 ? "+" : ""}{lcDelta.toFixed(1)} п.п.
                    </Badge>
                    <span className="text-sm text-muted-foreground">от бюджета {lcBudget}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>ТО без НДС</CardDescription>
                  <CardTitle className="text-3xl">12.4М₽</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Icon name="TrendingUp" size={16} />
                    <span>+8.2% к плану</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>ФОТ всего</CardDescription>
                  <CardTitle className="text-3xl">3.54М₽</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    ЧБР: 2.89М₽ • АУП: 0.65М₽
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="PieChart" size={20} />
                  Декомпозиция LC
                </CardTitle>
                <CardDescription>Распределение по источникам затрат</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-primary rounded"></div>
                      <div>
                        <div className="font-medium">ФОТ ЧБР</div>
                        <div className="text-sm text-muted-foreground">Линейный персонал</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">23.3%</div>
                      <div className="text-sm text-muted-foreground">2.89М₽</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-blue-400 rounded"></div>
                      <div>
                        <div className="font-medium">ФОТ АУП</div>
                        <div className="text-sm text-muted-foreground">Управленческий персонал</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">5.2%</div>
                      <div className="text-sm text-muted-foreground">0.65М₽</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-green-400 rounded"></div>
                      <div>
                        <div className="font-medium">Прочие расходы</div>
                        <div className="text-sm text-muted-foreground">Премии, НУ, отпуска</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">0.0%</div>
                      <div className="text-sm text-muted-foreground">0₽</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="AlertCircle" size={20} />
                  Требуют внимания
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lcDelta > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <Icon name="AlertTriangle" size={20} className="text-orange-500" />
                      <div className="flex-1">
                        <div className="font-medium text-orange-900">Превышение бюджета LC</div>
                        <div className="text-sm text-orange-700">Отклонение на {lcDelta.toFixed(1)} п.п. от целевого значения</div>
                      </div>
                    </div>
                  )}
                  {!lcData.comment && lcData.unexpectedHours > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Icon name="MessageSquare" size={20} className="text-blue-500" />
                      <div className="flex-1">
                        <div className="font-medium text-blue-900">Требуется комментарий</div>
                        <div className="text-sm text-blue-700">Добавлен непредвиденные часы без обоснования</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Редактирование плана LC</CardTitle>
                <CardDescription>Разрешённые для изменения параметры</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="generalCleaning">Генеральная уборка</Label>
                    <Select
                      value={lcData.generalCleaning ? "yes" : "no"}
                      onValueChange={(value) => handleLcUpdate("generalCleaning", value === "yes")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">Нет</SelectItem>
                        <SelectItem value="yes">Да</SelectItem>
                      </SelectContent>
                    </Select>
                    {lcData.generalCleaning && (
                      <p className="text-sm text-muted-foreground">+0.3% к LC</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unexpectedHours">Непредвиденные часы линейки</Label>
                    <Input
                      id="unexpectedHours"
                      type="number"
                      value={lcData.unexpectedHours}
                      onChange={(e) => handleLcUpdate("unexpectedHours", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                    {lcData.unexpectedHours > 0 && (
                      <p className="text-sm text-orange-600 flex items-center gap-1">
                        <Icon name="AlertCircle" size={14} />
                        Требуется комментарий
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bonusOnce">Разовая премия (₽)</Label>
                    <Input
                      id="bonusOnce"
                      type="number"
                      value={lcData.bonusOnce}
                      onChange={(e) => handleLcUpdate("bonusOnce", parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                    {lcData.bonusOnce > 0 && (
                      <p className="text-sm text-orange-600 flex items-center gap-1">
                        <Icon name="AlertCircle" size={14} />
                        Требуется комментарий
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="comment">
                    Комментарий
                    {(lcData.unexpectedHours > 0 || lcData.bonusOnce > 0) && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </Label>
                  <Textarea
                    id="comment"
                    value={lcData.comment}
                    onChange={(e) => setLcData({ ...lcData, comment: e.target.value })}
                    placeholder="Укажите причину отклонений от плана..."
                    rows={4}
                  />
                </div>

                <Separator />

                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <h3 className="font-semibold text-lg">Итоговые показатели</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">LC План</div>
                      <div className="text-2xl font-semibold">{lcValue}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">LC Бюджет</div>
                      <div className="text-2xl font-semibold">{lcBudget}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Отклонение</div>
                      <div className={`text-2xl font-semibold ${lcDelta > 0 ? 'text-destructive' : 'text-green-600'}`}>
                        {lcDelta > 0 ? "+" : ""}{lcDelta.toFixed(1)} п.п.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staffing" className="space-y-6">
            <Tabs defaultValue="m0">
              <TabsList>
                <TabsTrigger value="m0">М0 (Текущий)</TabsTrigger>
                <TabsTrigger value="m1">М+1</TabsTrigger>
                <TabsTrigger value="m2">М+2</TabsTrigger>
              </TabsList>

              <TabsContent value="m0" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Staffing ЧБР — Текущий месяц</CardTitle>
                    <CardDescription>Редактируемые параметры для расчёта персонала</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="m0-pt">% парт-таймеров (часы)</Label>
                        <Input
                          id="m0-pt"
                          type="number"
                          value={staffingM0.ptPercent}
                          onChange={(e) => setStaffingM0({ ...staffingM0, ptPercent: parseFloat(e.target.value) || 0 })}
                        />
                        <p className="text-sm text-muted-foreground">Коридор: 30-40%</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="m0-trainer">Коэф. тренера</Label>
                        <Input
                          id="m0-trainer"
                          type="number"
                          step="0.01"
                          value={staffingM0.trainerCoef}
                          onChange={(e) => setStaffingM0({ ...staffingM0, trainerCoef: parseFloat(e.target.value) || 0 })}
                        />
                        <p className="text-sm text-muted-foreground">Обычно 0.1</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="m0-ft-prod">Выработка FT (часы/мес)</Label>
                        <Input
                          id="m0-ft-prod"
                          type="number"
                          value={staffingM0.ftProductivity}
                          onChange={(e) => setStaffingM0({ ...staffingM0, ftProductivity: parseFloat(e.target.value) || 0 })}
                        />
                        <p className="text-sm text-muted-foreground">Стандарт: 160</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="m0-pt-prod">Выработка PT (часы/мес)</Label>
                        <Input
                          id="m0-pt-prod"
                          type="number"
                          value={staffingM0.ptProductivity}
                          onChange={(e) => setStaffingM0({ ...staffingM0, ptProductivity: parseFloat(e.target.value) || 0 })}
                        />
                        <p className="text-sm text-muted-foreground">Стандарт: 80</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Расчётные показатели</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">FT ставки</div>
                          <div className="text-xl font-semibold">{staffingResultM0.ftStaff}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">PT ставки</div>
                          <div className="text-xl font-semibold">{staffingResultM0.ptStaff}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Всего ставки</div>
                          <div className="text-xl font-semibold">{staffingResultM0.totalStaff}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">FT часы</div>
                          <div className="text-xl font-semibold">{staffingResultM0.ftHours}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">PT часы</div>
                          <div className="text-xl font-semibold">{staffingResultM0.ptHours}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="m1" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Staffing ЧБР — Прогноз М+1</CardTitle>
                    <CardDescription>Планирование на следующий месяц</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="m1-pt">% парт-таймеров</Label>
                        <Input
                          id="m1-pt"
                          type="number"
                          value={staffingM1.ptPercent}
                          onChange={(e) => setStaffingM1({ ...staffingM1, ptPercent: parseFloat(e.target.value) || 0 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="m1-ft-prod">Выработка FT</Label>
                        <Input
                          id="m1-ft-prod"
                          type="number"
                          value={staffingM1.ftProductivity}
                          onChange={(e) => setStaffingM1({ ...staffingM1, ftProductivity: parseFloat(e.target.value) || 0 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="m1-pt-prod">Выработка PT</Label>
                        <Input
                          id="m1-pt-prod"
                          type="number"
                          value={staffingM1.ptProductivity}
                          onChange={(e) => setStaffingM1({ ...staffingM1, ptProductivity: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Расчётные показатели</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">FT ставки</div>
                          <div className="text-xl font-semibold">{staffingResultM1.ftStaff}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">PT ставки</div>
                          <div className="text-xl font-semibold">{staffingResultM1.ptStaff}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Всего ставки</div>
                          <div className="text-xl font-semibold">{staffingResultM1.totalStaff}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">FT часы</div>
                          <div className="text-xl font-semibold">{staffingResultM1.ftHours}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">PT часы</div>
                          <div className="text-xl font-semibold">{staffingResultM1.ptHours}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="m2" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Staffing ЧБР — Прогноз М+2</CardTitle>
                    <CardDescription>Планирование через 2 месяца</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="m2-pt">% парт-таймеров</Label>
                        <Input
                          id="m2-pt"
                          type="number"
                          value={staffingM2.ptPercent}
                          onChange={(e) => setStaffingM2({ ...staffingM2, ptPercent: parseFloat(e.target.value) || 0 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="m2-ft-prod">Выработка FT</Label>
                        <Input
                          id="m2-ft-prod"
                          type="number"
                          value={staffingM2.ftProductivity}
                          onChange={(e) => setStaffingM2({ ...staffingM2, ftProductivity: parseFloat(e.target.value) || 0 })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="m2-pt-prod">Выработка PT</Label>
                        <Input
                          id="m2-pt-prod"
                          type="number"
                          value={staffingM2.ptProductivity}
                          onChange={(e) => setStaffingM2({ ...staffingM2, ptProductivity: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Расчётные показатели</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">FT ставки</div>
                          <div className="text-xl font-semibold">{staffingResultM2.ftStaff}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">PT ставки</div>
                          <div className="text-xl font-semibold">{staffingResultM2.ptStaff}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Всего ставки</div>
                          <div className="text-xl font-semibold">{staffingResultM2.totalStaff}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">FT часы</div>
                          <div className="text-xl font-semibold">{staffingResultM2.ftHours}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">PT часы</div>
                          <div className="text-xl font-semibold">{staffingResultM2.ptHours}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
